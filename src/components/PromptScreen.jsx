import { useState } from 'react'
import './PromptScreen.css'

function PromptScreen({ prompt, onSubmit }) {
  const [answer, setAnswer] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && answer.trim() !== '') {
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