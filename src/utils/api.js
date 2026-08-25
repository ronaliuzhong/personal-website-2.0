const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

export async function saveAnswerToBackend(visitorId, questionId, answer, visitorName) {
  const res = await fetch(`${API_URL}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: visitorId,
      question_id: questionId,
      answer,
      visitor_name: visitorName || null,
    }),
  })
  if (!res.ok) throw new Error('Failed to save answer')
  return res.json()
}

export async function getAnswerAggregate(questionId) {
  const res = await fetch(`${API_URL}/answers/aggregate/${questionId}`)
  if (!res.ok) throw new Error('Failed to fetch answer aggregate')
  return res.json()
}