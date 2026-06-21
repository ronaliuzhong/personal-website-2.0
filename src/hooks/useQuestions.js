import { questions } from '../data/questions'

export function useQuestions() {
  function getSeenQuestions() {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    return visitor.seenQuestions || []
  }

  function markSeen(questionId) {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    const seenQuestions = visitor.seenQuestions || []
    if (!seenQuestions.includes(questionId)) {
      seenQuestions.push(questionId)
    }
    localStorage.setItem('visitor', JSON.stringify({ ...visitor, seenQuestions }))
  }

  function saveAnswer(questionId, answer) {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    const answers = visitor.answers || {}
    answers[questionId] = answer
    localStorage.setItem('visitor', JSON.stringify({ ...visitor, answers }))
  }

  function getTriggeredQuestion(location, trigger) {
    const seen = getSeenQuestions()
    const triggered = questions.filter(
      q => q.type === 'triggered' &&
      q.location === location &&
      q.trigger === trigger
    ).sort((a, b) => a.sequence - b.sequence)

    return triggered.find(q => !seen.includes(q.id)) || null
  }

  function getAmbientQuestion(location) {
    const seen = getSeenQuestions()
    const ambient = questions.filter(
      q => q.type === 'ambient' &&
      (q.location === null || q.location === location) &&
      !seen.includes(q.id)
    )

    if (ambient.length === 0) return null
    return ambient[Math.floor(Math.random() * ambient.length)]
  }

  return {
    getTriggeredQuestion,
    getAmbientQuestion,
    markSeen,
    saveAnswer,
  }
}