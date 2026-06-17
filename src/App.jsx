import { useState } from 'react'
import OpeningScreen from './components/OpeningScreen'
import PromptScreen from './components/PromptScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('opening')
  const [happiness, setHappiness] = useState('')

  function handleEnter() {
    setScreen('prompt1')
  }

  function handlePrompt1Submit(answer) {
    setHappiness(answer)
    setScreen('prompt2')
  }

  return (
    <div className="app">
      {screen === 'opening' && (
        <OpeningScreen onEnter={handleEnter} />
      )}
      {screen === 'prompt1' && (
        <PromptScreen
          prompt="To know me, let me get to know you—what makes you happy?"
          onSubmit={handlePrompt1Submit}
        />
      )}
      {screen === 'prompt2' && (
        <PromptScreen
          prompt="I love that. What should I call you?"
          onSubmit={(name) => console.log('name:', name)}
        />
      )}
    </div>
  )
}

export default App