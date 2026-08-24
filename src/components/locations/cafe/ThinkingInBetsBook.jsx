import { useState } from 'react'
import { thinkingInBetsScenarios } from '../../../data/thinkingInBetsScenarios'
import './ThinkingInBetsBook.css'

// Genuine weighted random draw — not scripted. Given a probability of
// a "good" outcome, returns 'good' or 'bad' for real, each time.
function drawOutcome(probabilityGood) {
  return Math.random() < probabilityGood ? 'good' : 'bad'
}

const PROGRESS_KEY = 'thinkingInBetsProgress'

const defaultProgress = {
  scenarioIndex: 0,
  pickedOption: null, // 'A' | 'B' | null
  firstResult: null, // 'good' | 'bad' | null
  finished: false, // true once all 3 scenarios are done — shows the essay
}

// This book saves nothing to the visitor's answers or the backend —
// it's a self-contained local experience. Progress (which scenario
// you're on, what you picked, and whether you've finished) lives in
// its own localStorage entry so closing and reopening the book
// resumes exactly where you left off. "Start over" is the only thing
// that resets it.
function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { ...defaultProgress }
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch (err) {
    console.error('Failed to load Thinking in Bets progress:', err)
    return { ...defaultProgress }
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch (err) {
    console.error('Failed to save Thinking in Bets progress:', err)
  }
}

function ThinkingInBetsBook() {
  const [progress, setProgress] = useState(loadProgress)

  const { scenarioIndex, pickedOption, firstResult, finished } = progress
  const scenario = thinkingInBetsScenarios[scenarioIndex]

  function updateProgress(patch) {
    const next = { ...progress, ...patch }
    setProgress(next)
    saveProgress(next)
  }

  function handlePick(letter) {
    const option = letter === 'A' ? scenario.optionA : scenario.optionB
    updateProgress({
      pickedOption: letter,
      firstResult: drawOutcome(option.probabilityGood),
    })
  }

  function handleContinue() {
    if (scenarioIndex < thinkingInBetsScenarios.length - 1) {
      updateProgress({
        scenarioIndex: scenarioIndex + 1,
        pickedOption: null,
        firstResult: null,
      })
    } else {
      updateProgress({ finished: true })
    }
  }

  function handleStartOver() {
    updateProgress({ ...defaultProgress })
  }

  // ---- Essay screen (after finishing all 3 scenarios) ----
  if (finished) {
    return (
      <div className="tib-content">
        <p className="tib-essay-title">Ode to Gambling</p>
        <p className="tib-essay-paragraph">
          So, what was your score out of 3? Did you get good results or bad ones?
          What decisions would you have made differently, and why?
        </p>
        <p className="tib-essay-paragraph">
          If you got one with a bad result, then you may have been thinking of
          reasoning for why that choice was "wrong". But think back on why you
          chose your original decision—this reasoning hasn't just disappeared,
          right? Does its validity still stand? And is it still stronger than
          your new reasoning? Conversely, if you made a choice with a good
          result, did you automatically equate this with your strong reasoning
          skills?
        </p>
        <p className="tib-essay-paragraph">
          In Thinking in Bets, by psychologist and poker player Annie Duke, she
          talks of the ability to separate consequence from choice, as a result
          does not necessarily dictate the "correctness" of a choice. In poker,
          you could have a hand that has an 80% chance of winning…and still
          lose, because 80% is not 100%. If you ended up losing that hand, does
          that mean your feedback to yourself should be: "that was a losing
          hand, fold next time"? Or would you just call that bad luck since 20%
          is less than 80%?
        </p>
        <p className="tib-essay-paragraph">
          For much of my life, I had been subconsciously telling myself to
          "fold next time", whenever life threw me a bad result. But reading
          Duke's work made me realize that this concept can be applied to many
          of our life scenarios, where we know limited information and we can
          only guess which options have a higher probability of good results.
          These said results provide instantaneous feedback, ones that are
          oblivious to the percentages and give concrete answers. The ability
          to discriminate between when our reasoning actually needs improvement
          and when luck was not on our side is extremely difficult, but made
          significantly easier when you recognize that this distinction must be
          drawn at all.
        </p>
        <p className="tib-essay-paragraph">
          Now I implore you to play the game again—you can try the other answer
          if you believe the reasoning behind your first choice wasn't as
          strong. I wouldn't just choose what you know to be "right" and
          "wrong" though, because as we've established, there is no correct
          answer in most of life's scenarios, just choices with better odds.
        </p>
        <button className="tib-btn tib-btn--secondary tib-play-again" onClick={handleStartOver}>
          start over
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