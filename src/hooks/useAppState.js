import { useState, useEffect } from 'react'
import { SCREENS } from '../constants'

export function useAppState() {
  const [screen, setScreen] = useState(null)
  const [happiness, setHappiness] = useState('')
  const [name, setName] = useState('')
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor'))
    if (visitor?.name) {
      setName(visitor.name)
      setReturning(visitor.returning)
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
        returning: false,
        answers: { happiness: happiness }
    }
    localStorage.setItem('visitor', JSON.stringify(visitor))
    setScreen(SCREENS.welcome)
    setTimeout(() => {
        // mark as returning for next visit
        const updated = { ...visitor, returning: true }
        localStorage.setItem('visitor', JSON.stringify(updated))
        setScreen(SCREENS.map)
    }, 2000)
  }

  function handleEnterLocation(id) {
    console.log('entering', id)
  }

  return {
    screen,
    name,
    returning,
    handleEnter,
    handlePrompt1Submit,
    handlePrompt2Submit,
    handleEnterLocation,
  }
}