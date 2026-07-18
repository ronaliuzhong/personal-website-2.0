import { useState, useEffect } from 'react'
import { getJournalEntries, createJournalEntry } from '../../../utils/api'
import './CommunityJournal.css'

function JournalPage({ entry, pageNumber }) {
  return (
    <div className="journal-page">
      <p className="journal-page__content" style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
      <div className="journal-page__footer">
        <span className="journal-page__author">
          {entry.is_anonymous ? 'anonymous' : entry.nickname || 'anonymous'}
        </span>
        <span className="journal-page__number">{pageNumber}</span>
      </div>
    </div>
  )
}

function WritePage({ onSubmit, isSubmitting }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const visitor = JSON.parse(localStorage.getItem('visitor')) || {}

  function handleSubmit() {
    if (content.trim() === '') return
    onSubmit({ content, isAnonymous })
  }

  return (
    <div className="journal-page journal-page--write">
      <textarea
        className="journal-page__input"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="what's on your mind?"
        maxLength={500}
        autoFocus
      />
      <div className="journal-page__footer">
        <div className="journal-page__anon-toggle">
          <span className="journal-page__author">
            {isAnonymous ? 'anonymous' : visitor.name || 'anonymous'}
          </span>
          <button
            className="journal-page__toggle-btn"
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            {isAnonymous ? 'sign it' : 'go anonymous'}
          </button>
        </div>
        <button
          className="journal-page__submit"
          onClick={handleSubmit}
          disabled={isSubmitting || content.trim() === ''}
        >
          {isSubmitting ? 'saving...' : 'add to journal'}
        </button>
      </div>
    </div>
  )
}

function CommunityJournal({ onClose }) {
  const [entries, setEntries] = useState([])
  const [currentSpread, setCurrentSpread] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [writeKey, setWriteKey] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJournalEntries()
      .then(data => {
        // oldest first so first pages are oldest entries
        const sorted = [...data].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
        setEntries(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalSpreads = Math.ceil(entries.length / 2) + 1
  const writeSpreadIndex = totalSpreads - 1
  const isWriteSpread = currentSpread === writeSpreadIndex
  const leftEntry = entries[currentSpread * 2]
  const rightEntry = entries[currentSpread * 2 + 1]

  function flip(direction) {
    if (isFlipping) return
    if (direction === 'next' && currentSpread >= writeSpreadIndex) return
    if (direction === 'prev' && currentSpread <= 0) return
    setIsFlipping(true)
    setFlipDirection(direction)
    setTimeout(() => {
      setCurrentSpread(prev => direction === 'next' ? prev + 1 : prev - 1)
      setIsFlipping(false)
      setFlipDirection(null)
    }, 400)
  }

  async function handleSubmit({ content, isAnonymous }) {
    setIsSubmitting(true)
    try {
      await createJournalEntry({ content, isAnonymous })
      const updated = await getJournalEntries()
      const sorted = [...updated].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )
      setEntries(sorted)
      setWriteKey(prev => prev + 1)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="community-journal-overlay" onClick={onClose}>
      <div className="community-journal" onClick={e => e.stopPropagation()}>

        <button className="community-journal__close" onClick={onClose}>×</button>

        <div className={`community-journal__book ${isFlipping ? `flipping-${flipDirection}` : ''}`}>

          {/* left page */}
          <div className="community-journal__page community-journal__page--left">
            {loading ? (
              <div className="journal-page">
                <p className="journal-page__loading">opening the journal...</p>
              </div>
            ) : isWriteSpread ? (
              <div className="journal-page">
                <p className="journal-page__prompt">add your entry to the journal.</p>
                <p className="journal-page__prompt-sub">write anything. a thought, a feeling, a question.</p>
                <p className="journal-page__prompt-sub" style={{ marginTop: '12px' }}>
                  this journal is shared—anyone who visits can read what you write here. entries are permanent, so think before you submit.
                </p>
              </div>
            ) : leftEntry ? (
              <JournalPage entry={leftEntry} pageNumber={currentSpread * 2 + 1}/>
            ) : (
              <div className="journal-page journal-page--empty"/>
            )}
          </div>

          {/* spine */}
          <div className="community-journal__spine"/>

          {/* right page */}
          <div className="community-journal__page community-journal__page--right">
            {isWriteSpread ? (
              <WritePage
                key={writeKey}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            ) : rightEntry ? (
              <JournalPage entry={rightEntry} pageNumber={currentSpread * 2 + 2}/>
            ) : (
              <div className="journal-page journal-page--empty"/>
            )}
          </div>

        </div>

        {/* navigation */}
        <div className="community-journal__nav">
          <button
            className="community-journal__nav-btn"
            onClick={() => flip('prev')}
            disabled={currentSpread === 0}
          >
            ←
          </button>
          <span className="community-journal__nav-label">
            {isWriteSpread ? 'your page' : `${currentSpread + 1} of ${totalSpreads}`}
          </span>
          <button
            className="community-journal__nav-btn"
            onClick={() => flip('next')}
            disabled={currentSpread === writeSpreadIndex}
          >
            →
          </button>
        </div>

      </div>
    </div>
  )
}

export default CommunityJournal