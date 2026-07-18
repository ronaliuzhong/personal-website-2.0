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