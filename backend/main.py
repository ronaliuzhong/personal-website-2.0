from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ronaliuzhong.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# connect to supabase
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# --- models ---

class VisitorCreate(BaseModel):
    nickname: str

class AnswerCreate(BaseModel):
    visitor_id: str
    question_id: str
    answer: str

class JournalEntryCreate(BaseModel):
    visitor_id: str | None
    content: str
    is_anonymous: bool = False
    nickname: str | None

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
        "answer": answer.answer
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