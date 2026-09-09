from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
from rona_knowledge.create_system_prompt import SYSTEM_PROMPT
from dotenv import load_dotenv
import resend
import os

load_dotenv()

app = FastAPI()

# allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ronaliuzhong.vercel.app",
        "https://ronaliuzhong.com",
        "https://www.ronaliuzhong.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# connect to supabase
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# connect to OpenAI, for the Talk to Rona chatbot
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Resend, for emailing Rona when someone submits the contact form
resend.api_key = os.getenv("RESEND_API_KEY")

# --- models ---

class VisitorCreate(BaseModel):
    nickname: str

class AnswerCreate(BaseModel):
    visitor_id: str
    question_id: str
    answer: str
    visitor_name: str | None = None

class JournalEntryCreate(BaseModel):
    visitor_id: str | None
    content: str
    is_anonymous: bool = False
    nickname: str | None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]  # full conversation so far, newest message last
    visitor_id: str | None = None
    visitor_name: str | None = None

class ContactMessageCreate(BaseModel):
    name: str | None = None  # manually typed into the form itself
    email: str | None = None
    message: str
    visitor_name: str | None = None  # the visitor's established site nickname, if any

# --- routes ---

@app.get("/")
def root():
    return {"message": "rona-world backend is running"}

@app.get("/ping")
def ping():
    # Lightweight route for an external uptime monitor (e.g. UptimeRobot)
    # to hit every few minutes. Actually touches Supabase, not just a
    # static response, so this keeps both Render and Supabase warm.
    supabase.table("visitors").select("id").limit(1).execute()
    return {"status": "ok"}

@app.post("/visitors")
def create_visitor(visitor: VisitorCreate):
    result = supabase.table("visitors").insert({
        "nickname": visitor.nickname
    }).execute()
    return result.data[0]

@app.get("/visitors/{visitor_id}")
def get_visitor(visitor_id: str):
    result = supabase.table("visitors").select("*").eq("id", visitor_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return result.data[0]

@app.post("/answers")
def save_answer(answer: AnswerCreate):
    result = supabase.table("answers").insert({
        "visitor_id": answer.visitor_id,
        "question_id": answer.question_id,
        "answer": answer.answer,
        "visitor_name": answer.visitor_name
    }).execute()
    return result.data[0]

@app.get("/answers/{visitor_id}")
def get_answers(visitor_id: str):
    result = supabase.table("answers").select("*").eq("visitor_id", visitor_id).execute()
    return result.data

@app.get("/answers/aggregate/{question_id}")
def get_answer_aggregate(question_id: str):
    result = supabase.table("answers").select("answer").eq("question_id", question_id).execute()
    rows = result.data

    total = len(rows)
    if total == 0:
        return {"question_id": question_id, "total": 0, "breakdown": []}

    counts = {}
    for row in rows:
        answer = row["answer"]
        counts[answer] = counts.get(answer, 0) + 1

    breakdown = [
        {"answer": answer, "count": count, "percentage": round((count / total) * 100, 1)}
        for answer, count in counts.items()
    ]
    breakdown.sort(key=lambda x: x["count"], reverse=True)

    return {"question_id": question_id, "total": total, "breakdown": breakdown}

@app.post("/journal")
def create_journal_entry(entry: JournalEntryCreate):
    result = supabase.table("journal_entries").insert({
        "visitor_id": entry.visitor_id,
        "content": entry.content,
        "is_anonymous": entry.is_anonymous,
        "nickname": entry.nickname if not entry.is_anonymous else None
    }).execute()
    return result.data[0]

@app.get("/journal")
def get_journal_entries():
    result = supabase.table("journal_entries").select("*").order("created_at", desc=True).execute()
    return result.data

@app.post("/chat")
def chat(request: ChatRequest):
    # "Long-context stuffing" — SYSTEM_PROMPT already contains Rona's
    # entire knowledge base (essays, bio facts, conversational style,
    # voice notes, boundaries) assembled into one string. No retrieval
    # step at all — the whole thing gets sent on every single message,
    # and the model itself figures out what's relevant to the current
    # question. Reasonable at this content size; see CLAUDE.md for the
    # fuller reasoning on why this beats real RAG at this scale.
    input_messages = [{"role": m.role, "content": m.content} for m in request.messages]

    response = openai_client.responses.create(
        model="gpt-5.6-luna",
        instructions=SYSTEM_PROMPT,
        input=input_messages,
    )

    reply_text = response.output_text

    # Save just THIS turn's new exchange — the frontend resends the
    # entire conversation every time (so the model has context), but
    # every message except the very last one was already saved on a
    # previous call. Saving the whole array again here would duplicate
    # every old message into a new row each turn.
    try:
        latest_user_message = request.messages[-1]
        supabase.table("chat_messages").insert([
            {
                "visitor_id": request.visitor_id,
                "visitor_name": request.visitor_name,
                "role": latest_user_message.role,
                "content": latest_user_message.content,
            },
            {
                "visitor_id": request.visitor_id,
                "visitor_name": request.visitor_name,
                "role": "assistant",
                "content": reply_text,
            },
        ], returning="minimal").execute()
    except Exception as e:
        # Never let a Supabase hiccup break the actual chat reply —
        # same "local-first, best-effort backend sync" approach used
        # elsewhere on this site (e.g. saveAnswerToBackend's .catch()).
        print(f"Failed to save chat message: {e}")

    return {"reply": reply_text}

@app.post("/contact")
def create_contact_message(message: ContactMessageCreate):
    # Unlike chat_messages' background logging, a failure here is NOT
    # swallowed — if someone's real attempt to reach Rona fails to
    # save, they need to actually know, rather than walking away
    # thinking their message went through when it didn't.
    supabase.table("contact_messages").insert({
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "visitor_name": message.visitor_name,
    }, returning="minimal").execute()

    # Email notification is best-effort, unlike the save above — the
    # message is already safely durable in Supabase by this point
    # regardless of whether this succeeds, so an email hiccup shouldn't
    # make the visitor think their message was lost.
    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": os.getenv("NOTIFICATION_EMAIL"),
            "subject": "New message from your site",
            "text": f"From: {message.name or 'anonymous'} ({message.email or 'no email given'})\n\n{message.message}",
        })
    except Exception as e:
        print(f"Failed to send contact notification email: {e}")

    # With returning="minimal", there's no row data to hand back — the
    # frontend only ever checked res.ok anyway, never the response body.
    return {"success": True}