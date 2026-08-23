import { useState, useEffect } from 'react'
import { useQuestions } from '../../../hooks/useQuestions'
import { getAnswerAggregate } from '../../../utils/api'
import { whichLifeQuestionId, whichLifeOptions } from '../../../data/whichLifeOptions'
import './WhichLifeBook.css'

function WhichLifeBook() {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions()
  // 'checking' | 'choosing' | 'loading' | 'results'
  const [phase, setPhase] = useState('checking')
  const [aggregate, setAggregate] = useState(null)
  const [myPick, setMyPick] = useState(null)

  // On mount: if this visitor already picked, skip straight to
  // results instead of letting them pick again and overwrite their
  // original answer (same guard EthicsGameBook uses).
  useEffect(() => {
    const seen = getSeenQuestions()
    if (seen.includes(whichLifeQuestionId)) {
      loadResults()
    } else {
      setPhase('choosing')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePick(option) {
    saveAnswer(whichLifeQuestionId, option.id)
    markSeen(whichLifeQuestionId)
    setMyPick(option.id)
    loadResults()
  }

  async function loadResults() {
    setPhase('loading')
    try {
      const agg = await getAnswerAggregate(whichLifeQuestionId)
      setAggregate(agg)
    } catch (err) {
      console.error('Failed to load which-life aggregate:', err)
      setAggregate(null)
    }
    setPhase('results')
  }

  if (phase === 'checking' || phase === 'loading') {
    return (
      <div className="which-life-content">
        <p className="which-life-loading">tallying everyone's answers...</p>
      </div>
    )
  }

  if (phase === 'choosing') {
    return (
      <div className="which-life-content">
        <p className="which-life-intro">Which life would you rather live?</p>
        <div className="which-life-options">
          {whichLifeOptions.map((option) => (
            <button
              key={option.id}
              className="which-life-option-btn"
              onClick={() => handlePick(option)}
            >
              <span className="which-life-option-label">{option.label}</span>
              <span className="which-life-option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // phase === 'results'
  const breakdown = aggregate?.breakdown || []
  const total = aggregate?.total || 0

  return (
    <div className="which-life-content">
      <p className="which-life-results-heading">what everyone else picked</p>
      {total > 0 ? (
        <div className="which-life-results">
          {whichLifeOptions.map((option) => {
            const stat = breakdown.find((b) => b.answer === option.id)
            const percentage = stat ? stat.percentage : 0
            const isMine = myPick === option.id
            return (
              <div
                key={option.id}
                className={`which-life-result-row ${isMine ? 'which-life-result-row--mine' : ''}`}
              >
                <div className="which-life-result-label-row">
                  <span className="which-life-result-label">{option.label}</span>
                  <span className="which-life-result-percent">{percentage}%</span>
                </div>
                <div className="which-life-result-bar-track">
                  <div
                    className="which-life-result-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="which-life-result-empty">no data yet</p>
      )}
    </div>
  )
}

export default WhichLifeBook