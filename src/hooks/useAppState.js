import { useState, useEffect, useRef } from 'react'
import { SCREENS } from '../constants'
import { createVisitor, saveAnswerToBackend } from '../utils/api'

export function useAppState() {
  const [screen, setScreen] = useState(null)
  const [happiness, setHappiness] = useState('')
  const [name, setName] = useState('')
  const [returning, setReturning] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const hasBackfilled = useRef(false)

  useEffect(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor'))
    if (visitor?.name) {
      setName(visitor.name)
      setReturning(visitor.returning)
      setScreen(SCREENS.map)

      if (!visitor.id && !hasBackfilled.current) {
        hasBackfilled.current = true
        createVisitor(visitor.name)
          .then((backendVisitor) => {
            localStorage.setItem('visitor', JSON.stringify({ ...visitor, id: backendVisitor.id }))

            if (visitor.answers?.happiness) {
              saveAnswerToBackend(backendVisitor.id, 'happiness', visitor.answers.happiness, visitor.name).catch((err) =>
                console.error('Failed to sync happiness answer to backend:', err)
              )
            }
          })
          .catch((err) => console.error('Failed to backfill visitor id:', err))
      }
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

    // Sync to backend in the background — doesn't block the UI.
    createVisitor(capitalized)
      .then((backendVisitor) => {
        const current = JSON.parse(localStorage.getItem('visitor')) || {}
        localStorage.setItem('visitor', JSON.stringify({ ...current, id: backendVisitor.id }))

        // The happiness answer is captured before a visitor id exists,
        // so it isn't caught by useQuestions' saveAnswer — sync it here
        // instead, now that we finally have an id to attach it to.
        saveAnswerToBackend(backendVisitor.id, 'happiness', happiness, capitalized).catch((err) =>
          console.error('Failed to sync happiness answer to backend:', err)
        )
      })
      .catch((err) => console.error('Failed to sync visitor to backend:', err))

    setTimeout(() => {
        // mark as returning for next visit
        const updated = JSON.parse(localStorage.getItem('visitor')) || visitor
        localStorage.setItem('visitor', JSON.stringify({ ...updated, returning: true }))
        setScreen(SCREENS.map)
    }, 2000)
  }

  function handleEnterLocation(id) {
    setCurrentLocation(id)
    setScreen(SCREENS.location)
  }

  function handleExitLocation() {
    setCurrentLocation(null)
    setScreen(SCREENS.map)
  }

  return {
    screen,
    name,
    returning,
    currentLocation,
    handleEnter,
    handlePrompt1Submit,
    handlePrompt2Submit,
    handleEnterLocation,
    handleExitLocation,
  }
}