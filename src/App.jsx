import { useState, useEffect } from 'react'
import OpeningScreen from './components/OpeningScreen'
import PromptScreen from './components/PromptScreen'
import WelcomeScreen from './components/WelcomeScreen'
import WorldMap from './components/WorldMap'
import { SCREENS } from './constants'
import './App.css'

function App() {
  const [screen, setScreen] = useState(null)
  const [happiness, setHappiness] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor'))
    if (visitor?.name) {
      setName(visitor.name)
      setScreen(SCREENS.map)
    } else {
      setScreen(SCREENS.opening)
    }
  }, [])

  function handleEnter() {
    setScreen(SCREENS.prompt1)
  }

  function handlePrompt1Submit(answer) {
    setHappiness(answer)
    setScreen(SCREENS.prompt2)
  }

  function handlePrompt2Submit(answer) {
    const capitalized = answer.charAt(0).toUpperCase() + answer.slice(1)
    setName(capitalized)
    const visitor = {
      name: capitalized,
      answers: { happiness: happiness }
    }
    localStorage.setItem('visitor', JSON.stringify(visitor))
    setScreen(SCREENS.welcome)
    setTimeout(() => setScreen(SCREENS.map), 2500)
  }

  if (screen === null) return null

  return (
    <div className="app">
      {screen === SCREENS.opening && (
        <OpeningScreen onEnter={handleEnter} />
      )}
      {screen === SCREENS.prompt1 && (
        <PromptScreen
          prompt="To know me, let me get to know you—what makes you happy?"
          onSubmit={handlePrompt1Submit}
        />
      )}
      {screen === SCREENS.prompt2 && (
        <PromptScreen
          prompt="I love that. What should I call you?"
          onSubmit={handlePrompt2Submit}
        />
      )}
      {screen === SCREENS.welcome && (
        <WelcomeScreen name={name} />
      )}
      {screen === SCREENS.map && (
        <WorldMap
          name={name}
          onEnterLocation={(id) => console.log('entering', id)}
        />
      )}
    </div>
  )
}

export default App