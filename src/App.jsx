import { useState } from 'react'
import OpeningScreen from './components/OpeningScreen'
import PromptScreen from './components/PromptScreen'
import WelcomeScreen from './components/WelcomeScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('opening')
  const [happiness, setHappiness] = useState('')
  const [name, setName] = useState('')

  function handleEnter() {
    setScreen('prompt1')
  }

  function handlePrompt1Submit(answer) {
    setHappiness(answer)
    setScreen('prompt2')
  }

  function handlePrompt2Submit(answer) {
    const capitalized = answer.charAt(0).toUpperCase() + answer.slice(1)
    setName(capitalized)
    setScreen('welcome')
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
          onSubmit={handlePrompt2Submit}
        />
      )}
      {screen === 'welcome' && (
        <WelcomeScreen name={name} />
      )}
    </div>
  )
}

export default App