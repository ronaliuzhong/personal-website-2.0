import { useState } from 'react'
import './ContactRona.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function ContactRona({ onBack }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim() || status === 'sending') return

    setStatus('sending')
    // Same lightweight pattern used elsewhere on the site — just
    // reading the visitor object straight out of localStorage.
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          message: message.trim(),
          visitor_name: visitor.name || null,
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
    } catch (err) {
      console.error('Failed to send contact message:', err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-rona">
        <p className="contact-rona__sent">
          Got it—thank you for actually reaching out. I'll see this soon.
        </p>
        <button className="contact-rona__back" onClick={onBack}>
          ← back to chat
        </button>
      </div>
    )
  }

  return (
    <div className="contact-rona">
      <p className="contact-rona__intro">
        Want to reach the real me instead? Leave a message below.
      </p>
      <form className="contact-rona__form" onSubmit={handleSubmit}>
        <input
          className="contact-rona__input"
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="contact-rona__input"
          type="email"
          placeholder="Email (optional, if you want a reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="contact-rona__textarea"
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
        {status === 'error' && (
          <p className="contact-rona__error">
            Something went wrong sending that—mind trying again?
          </p>
        )}
        <div className="contact-rona__actions">
          <button type="button" className="contact-rona__back" onClick={onBack}>
            ← back to chat
          </button>
          <button
            type="submit"
            className="contact-rona__send"
            disabled={status === 'sending' || !message.trim()}
          >
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactRona