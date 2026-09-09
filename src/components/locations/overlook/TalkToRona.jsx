import { useState, useRef, useEffect } from 'react'
import ContactRona from './ContactRona'
import './TalkToRona.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const STORAGE_KEY = 'talkToRonaHistory'

function TalkToRona() {
  // Loaded once, on first mount — this is what lets the conversation
  // survive closing and reopening the modal (even a full page refresh),
  // instead of resetting every time, same pattern as "bet"'s progress.
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [showContact, setShowContact] = useState(false)

  // Runs every time `messages` changes — which covers both cases at
  // once: a new message arriving mid-conversation, AND the very first
  // render when the modal opens with restored history from
  // localStorage (mounting counts as this effect's first run too).
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function saveMessages(updated) {
    setMessages(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  async function handleSend() {
    if (!input.trim() || loading) return

    const newMessages = [...messages, { role: 'user', content: input.trim() }]
    saveMessages(newMessages)
    setInput('')
    setLoading(true)

    // Same lightweight pattern used elsewhere on the site (WorldMap's
    // cafeVisited flag, LocationScreen's bookClicked) — just reading
    // the visitor object straight out of localStorage, no shared hook
    // needed for something this simple.
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, visitor_id: visitor.id || null, visitor_name: visitor.name || null }),
      })
      const data = await res.json()
      saveMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Chat request failed:', err)
      saveMessages([
        ...newMessages,
        { role: 'assistant', content: "Sorry, something went wrong on my end—try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    saveMessages([])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (showContact) {
    return (
      <div className="talk-to-rona">
        <p className="talk-to-rona__disclaimer">
          An AI trained on my real writing—not literally texting me live, but built by me to sound like me.
        </p>
        <ContactRona onBack={() => setShowContact(false)} />
      </div>
    )
  }

  return (
    <div className="talk-to-rona">
      <p className="talk-to-rona__disclaimer">
        An AI trained on my real writing—not literally me texting live, but built by me to sound like me.
      </p>
      <div className="talk-to-rona__messages">
        {messages.length === 0 && (
          <p className="talk-to-rona__empty">Ask me anything.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`talk-to-rona__bubble talk-to-rona__bubble--${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="talk-to-rona__bubble talk-to-rona__bubble--assistant talk-to-rona__bubble--loading">
            ...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="talk-to-rona__input-row">
        <textarea
          className="talk-to-rona__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
        <button
          className="talk-to-rona__send"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
      <div className="talk-to-rona__footer-links">
        {messages.length > 0 && (
          <button className="talk-to-rona__clear" onClick={handleClear}>
            clear conversation
          </button>
        )}
        <button className="talk-to-rona__clear" onClick={() => setShowContact(true)}>
          send a real message to rona
        </button>
      </div>
    </div>
  )
}

export default TalkToRona