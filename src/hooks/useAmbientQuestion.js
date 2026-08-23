import { useState, useRef, useEffect } from 'react'
import { useQuestions } from './useQuestions'

// Reusable ambient-question timer. Two tiers:
// - "local": frequent questions scoped to this specific location
// - "global": rare questions that could show up anywhere (location: null)
//
// active: pass false to pause scheduling (e.g. only run while a
// specific scene within a location is being viewed).
export function useAmbientQuestion(location, {
  active = true,
  suppress = false,
  localDelay = [180000, 360000],   // 3–6 minutes
  globalDelay = [240000, 360000], // 4–6 minutes
} = {}) {
  const { getAmbientQuestion, getGlobalAmbientQuestion } = useQuestions()
  const [question, setQuestion] = useState(null)
  const localTimerRef = useRef(null)
  const globalTimerRef = useRef(null)
  const suppressRef = useRef(suppress)

  useEffect(() => {
    suppressRef.current = suppress
  }, [suppress])

  function randomDelay([min, max]) {
    return min + Math.random() * (max - min)
  }

  function scheduleLocal() {
    localTimerRef.current = setTimeout(() => {
      if (suppressRef.current) {
        scheduleLocal() // something else is open right now — check again later
        return
      }
      const q = getAmbientQuestion(location, { includeGlobal: false })
      if (q) {
        setQuestion(q)
      } else {
        scheduleLocal() // pool empty for now — just try again later
      }
    }, randomDelay(localDelay))
  }

  function scheduleGlobal() {
    globalTimerRef.current = setTimeout(() => {
      if (suppressRef.current) {
        scheduleGlobal()
        return
      }
      const q = getGlobalAmbientQuestion()
      if (q) setQuestion(q)
      scheduleGlobal()
    }, randomDelay(globalDelay))
  }

  useEffect(() => {
    if (!active) return

    scheduleLocal()
    scheduleGlobal()

    return () => {
      clearTimeout(localTimerRef.current)
      clearTimeout(globalTimerRef.current)
    }
  }, [active])

  function close() {
    setQuestion(null)
    if (active) scheduleLocal()
  }

  return { question, close }
}