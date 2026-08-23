import { useState } from 'react'
import { useQuestions } from '../../../hooks/useQuestions'
import { thinkingInBetsQuestionId, thinkingInBetsScenarios } from '../../../data/thinkingInBetsScenarios'
import './ThinkingInBetsBook.css'

// Genuine weighted random draw — not scripted. Given a probability of
// a "good" outcome, returns 'good' or 'bad' for real, each time.
function drawOutcome(probabilityGood) {
  return Math.random() < probabilityGood ? 'good' : 'bad'
}

function ThinkingInBetsBook() {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions()
  const alreadySeen = getSeenQuestions().includes(thinkingInBetsQuestionId)

  // 'playing' | 'essay'. A visitor who already answered the reflection
  // (in this visit or a past one) always opens straight to the essay —
  // 'playing' is only the state while working through the 3 scenarios,
  // whether that's the first time or a later "play again."
  const [phase, setPhase] = useState(alreadySeen ? 'essay' : 'playing')
  const [answered, setAnswered] = useState(alreadySeen)
  const [scenarioIndex, setScenarioIndex] = useState(0)

  // Per-scenario round state
  const [pickedOption, setPickedOption] = useState(null) // 'A' | 'B' | null
  const [firstResult, setFirstResult] = useState(null) // 'good' | 'bad' | null

  const [reflectionText, setReflectionText] = useState('')

  const scenario = thinkingInBetsScenarios[scenarioIndex]

  function resetRoundState() {
    setPickedOption(null)
    setFirstResult(null)
  }

  function handlePick(letter) {
    const option = letter === 'A' ? scenario.optionA : scenario.optionB
    setPickedOption(letter)
    setFirstResult(drawOutcome(option.probabilityGood))
  }

  function handleContinue() {
    if (scenarioIndex < thinkingInBetsScenarios.length - 1) {
      setScenarioIndex(scenarioIndex + 1)
      resetRoundState()
    } else {
      setPhase('essay')
    }
  }

  function handleSubmitReflection() {
    if (!reflectionText.trim()) return
    saveAnswer(thinkingInBetsQuestionId, reflectionText.trim())
    markSeen(thinkingInBetsQuestionId)
    setAnswered(true)
  }

  // Reopens the 3 scenarios from scratch. Unlimited — doesn't touch
  // the saved reflection answer or seen status, so closing and
  // reopening the book later always lands back on the essay screen
  // regardless of how many extra times someone plays again.
  function handlePlayAgain() {
    setScenarioIndex(0)
    resetRoundState()
    setPhase('playing')
  }

  // ---- Essay screen (after finishing the scenarios, or on any later visit) ----
  if (phase === 'essay') {
    return (
      <div className="tib-content">
        <p className="tib-essay-title">Ode to Gambling</p>
        <p className="tib-essay-placeholder">{'{/* TODO: essay */}'}</p>
        {!answered && (
          <div className="tib-reflection">
            <p className="tib-reflection-prompt">
              Did the way things turned out change how good your choices felt to you?
            </p>
            <textarea
              className="tib-reflection-input"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="type your answer..."
              rows={3}
            />
            <button
              className="tib-btn tib-btn--primary"
              onClick={handleSubmitReflection}
              disabled={!reflectionText.trim()}
            >
              done
            </button>
          </div>
        )}
        <button className="tib-btn tib-btn--secondary tib-play-again" onClick={handlePlayAgain}>
          play again
        </button>
      </div>
    )
  }

  // ---- Playing: choosing an option ----
  if (!pickedOption) {
    return (
      <div className="tib-content">
        <p className="tib-scenario-count">
          scenario {scenarioIndex + 1} of {thinkingInBetsScenarios.length}
        </p>
        <div className="tib-prompt">
          {scenario.promptLines.map((line, i) => (
            <p key={i} className="tib-prompt-line">{line}</p>
          ))}
        </div>
        <div className="tib-options">
          <button className="tib-option-btn" onClick={() => handlePick('A')}>
            {scenario.optionA.label}
          </button>
          <button className="tib-option-btn" onClick={() => handlePick('B')}>
            {scenario.optionB.label}
          </button>
        </div>
      </div>
    )
  }

  // ---- Playing: showing the result of the picked option ----
  const chosenOption = pickedOption === 'A' ? scenario.optionA : scenario.optionB
  const chosenResultText = firstResult === 'good' ? chosenOption.textGood : chosenOption.textBad

  return (
    <div className="tib-content">
      <p className={`tib-result-text tib-result-text--${firstResult}`}>{chosenResultText}</p>
      <div className="tib-post-result-actions">
        <button className="tib-btn tib-btn--primary" onClick={handleContinue}>
          continue
        </button>
      </div>
    </div>
  )
}

export default ThinkingInBetsBook