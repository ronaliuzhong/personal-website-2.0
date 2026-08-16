import { useState, useEffect } from 'react'
import { useQuestions } from '../hooks/useQuestions'
import { themes } from '../data/themes'
import KissMarryKill from './questionInputs/KissMarryKill'
import './QuestionCard.css'

function QuestionCard({ question, location, onClose }) {
  const [answer, setAnswer] = useState('')
  const [visible, setVisible] = useState(false)
  const [guessed, setGuessed] = useState(null)
  const [followUp, setFollowUp] = useState(null) // { text } once ambient_2's own answer becomes the new prompt
  const { markSeen, saveAnswer } = useQuestions()
  const theme = themes[location] || themes.cafe
  const isSchool = theme.type === 'school'
  const isOverlook = theme.type === 'overlook'
  const isDark = isSchool || isOverlook
  const isRest = question?.isRest

  // Once a follow-up is active, everything renders based on IT instead
  // of the original question — same shape (just a text prompt), so no
  // other rendering logic needs to change.
  const activeQuestion = followUp || question

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 500)
  }

  function handleSubmit() {
    if (answer.trim() === '') return

    // Already answering the follow-up card (their own icebreaker,
    // asked right back to them) — just save normally and close.
    if (followUp) {
      saveAnswer('ambient_2_followup', answer)
      markSeen('ambient_2_followup')
      handleClose()
      return
    }

    saveAnswer(question.id, answer)
    markSeen(question.id)

    // Special case: the icebreaker question gets asked right back —
    // their own typed answer becomes the new prompt, with a fresh input.
    if (question.id === 'ambient_2') {
      setFollowUp({ text: answer, inputType: 'text' })
      setAnswer('')
      return
    }

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

  function handleKmkComplete(result) {
    saveAnswer(question.id, result)
    markSeen(question.id)
    handleClose()
  }

  function handleGuess(option) {
    setGuessed(option)
  }

  function handleRevealContinue() {
    saveAnswer(question.id, guessed)
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
              <p className="question-card__text">{activeQuestion.text}</p>

              {activeQuestion.inputType === 'text' && (
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

              {question.inputType === 'kmk' && (
                <KissMarryKill options={question.options} onComplete={handleKmkComplete} />
              )}

              {question.inputType === 'twoTruths' && (
                <div className="question-card__two-truths">
                  {!guessed ? (
                    <div className="question-card__choices">
                      {question.options.map(option => (
                        <button
                          key={option}
                          className="question-card__choice-btn"
                          onClick={() => handleGuess(option)}
                          style={!isDark ? { borderColor: theme.accentColor } : {}}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="question-card__reveal-message">
                        {guessed === question.correctAnswer
                          ? "You caught it! That was the lie."
                          : `Nope — actually, this was the lie: "${question.correctAnswer}"`}
                      </p>
                      <div className="question-card__choices">
                        {question.options.map(option => {
                          const isLie = option === question.correctAnswer
                          const wasGuessed = option === guessed
                          return (
                            <button
                              key={option}
                              className={`question-card__choice-btn ${isLie ? 'question-card__choice-btn--lie' : ''} ${wasGuessed && !isLie ? 'question-card__choice-btn--wrong' : ''}`}
                              disabled
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                      <button className="question-card__maybe-later" onClick={handleRevealContinue}>
                        continue
                      </button>
                    </>
                  )}
                </div>
              )}

              {!(question.inputType === 'twoTruths' && guessed) && (
                <button
                  className="question-card__maybe-later"
                  onClick={handleMaybeLater}
                >
                  maybe another time
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard