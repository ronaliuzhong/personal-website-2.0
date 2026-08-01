const API_URL = 'http://localhost:8000'

export async function getJournalEntries() {
  const res = await fetch(`${API_URL}/journal`)
  if (!res.ok) throw new Error('Failed to fetch journal entries')
  return res.json()
}

export async function createJournalEntry({ content, isAnonymous, nickname }) {
  const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
  const res = await fetch(`${API_URL}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: visitor.id || null,
      content,
      is_anonymous: isAnonymous,
      nickname: isAnonymous ? null : (visitor.name || nickname),
    }),
  })
  if (!res.ok) throw new Error('Failed to save journal entry')
  return res.json()
}

export async function createVisitor(nickname) {
  const res = await fetch(`${API_URL}/visitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  })
  if (!res.ok) throw new Error('Failed to create visitor')
  return res.json()
}

export async function saveAnswerToBackend(visitorId, questionId, answer) {
  const res = await fetch(`${API_URL}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: visitorId,
      question_id: questionId,
      answer,
    }),
  })
  if (!res.ok) throw new Error('Failed to save answer')
  return res.json()
}

/*
response shape:
{
  "question_id": "ethics_trolley",
  "total": 12,
  "breakdown": [
    { "answer": "Pull the lever", "count": 9, "percentage": 75.0 },
    { "answer": "Don't pull it", "count": 3, "percentage": 25.0 }
  ]
}
*/
export async function getAnswerAggregate(questionId) {
  const res = await fetch(`${API_URL}/answers/aggregate/${questionId}`)
  if (!res.ok) throw new Error('Failed to fetch answer aggregate')
  return res.json()
}