import { useState, useEffect } from 'react'
import { useQuestions } from '../hooks/useQuestions'
import { themes } from '../data/themes'
import './QuestionCard.css'

function QuestionCard({ question, location, onClose }) {
  const [answer, setAnswer] = useState('')
  const [visible, setVisible] = useState(false)
  const { markSeen, saveAnswer } = useQuestions()
  const theme = themes[location] || themes.cafe
  const isSchool = theme.type === 'school'
  const isOverlook = theme.type === 'overlook'
  const isDark = isSchool || isOverlook
  const isRest = question?.isRest

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 500)
  }

  function handleSubmit() {
    if (answer.trim() === '') return
    saveAnswer(question.id, answer)
    markSeen(question.id)
    handleClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleChoice(option) {
    saveAnswer(question.id, option)
    markSeen(question.id)
    handleClose()
  }

  function handleMaybeLater() {
    handleClose()
  }

  return (
    <div className={`question-card-overlay ${visible ? 'visible' : ''}`}>
      <div
        className={`question-card ${theme.cardClass} ${visible ? 'flipped' : ''}`}
        style={!isDark ? { borderColor: theme.accentColor } : {}}
      >
        {/* school gets full title bar */}
        {isSchool ? (
          <div className="question-card__header">
            <span className="question-card__header-title">
              {isRest ? 'RonalzOS — system_message.exe' : theme.headerText}
            </span>
            <button className="question-card__close--school" onClick={handleClose}>×</button>
          </div>
        ) : (
          <button className="question-card__close" onClick={handleClose}>×</button>
        )}

        <div className="question-card__body">
          {isRest ? (
            <p className="question-card__text question-card__rest">
              let your brain rest for now. we can ponder again soon.
            </p>
          ) : (
            <>
              <p className="question-card__text">{question.text}</p>

              {question.inputType === 'text' && (
                <div className="question-card__input-wrap">
                  <input
                    className="question-card__input"
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <div
                    className="question-card__line"
                    style={!isDark ? { background: 'var(--color-warm-gray)' } : {}}
                  />
                </div>
              )}

              {question.inputType === 'choice' && (
                <div className="question-card__choices">
                  {question.options.map(option => (
                    <button
                      key={option}
                      className="question-card__choice-btn"
                      onClick={() => handleChoice(option)}
                      style={!isDark ? { borderColor: theme.accentColor } : {}}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="question-card__maybe-later"
                onClick={handleMaybeLater}
              >
                maybe another time
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard