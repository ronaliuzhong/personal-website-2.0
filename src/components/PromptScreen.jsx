import { useSounds } from '../hooks/useSounds'
import { useState } from 'react'
import './PromptScreen.css'

function PromptScreen({ prompt, onSubmit }) {
  const [answer, setAnswer] = useState('')
  const { playSubmit } = useSounds()

  function handleKeyDown(e) {
    if (e.key === 'Enter' && answer.trim() !== '') {
      playSubmit()
      onSubmit(answer)
    }
  }

  return (
    <div className="prompt-screen">
      <p className="prompt-text">"{prompt}"</p>
      <input
        className="prompt-input"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}

export default PromptScreen