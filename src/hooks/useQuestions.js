import { questions } from '../data/questions'

const REST_AFTER = 2 // show rest message after every N intentional questions

export function useQuestions() {

  function getVisitor() {
    return JSON.parse(localStorage.getItem('visitor')) || {}
  }

  function saveVisitor(visitor) {
    localStorage.setItem('visitor', JSON.stringify(visitor))
  }

  function getSeenQuestions() {
    return getVisitor().seenQuestions || []
  }

  function markSeen(questionId) {
    const visitor = getVisitor()
    const seenQuestions = visitor.seenQuestions || []
    if (!seenQuestions.includes(questionId)) {
      seenQuestions.push(questionId)
    }
    saveVisitor({ ...visitor, seenQuestions })
  }

  function saveAnswer(questionId, answer) {
    const visitor = getVisitor()
    const answers = visitor.answers || {}
    answers[questionId] = answer
    saveVisitor({ ...visitor, answers })
  }

  function incrementIntentionalCount() {
    const visitor = getVisitor()
    const count = (visitor.intentionalQuestionCount || 0) + 1
    saveVisitor({ ...visitor, intentionalQuestionCount: count })
    return count
  }

  function getIntentionalCount() {
    return getVisitor().intentionalQuestionCount || 0
  }

  function shouldRest() {
    const count = getIntentionalCount()
    return count > 0 && count % REST_AFTER === 0
  }

  function getTriggeredQuestion(location, trigger) {
    const seen = getSeenQuestions()
    const triggered = questions
      .filter(q =>
        q.type === 'triggered' &&
        q.location === location &&
        q.trigger === trigger &&
        !seen.includes(q.id)
      )
      .sort((a, b) => a.sequence - b.sequence)

    return triggered[0] || null
  }

  function getAmbientQuestion(location) {
    const seen = getSeenQuestions()
    const ambient = questions.filter(q =>
      q.type === 'ambient' &&
      (q.location === null || q.location === location) &&
      !seen.includes(q.id)
    )

    if (ambient.length === 0) return null
    return ambient[Math.floor(Math.random() * ambient.length)]
  }

  function getIntentionalQuestion(location, trigger) {
    // check rest first
    if (shouldRest()) return { isRest: true }

    const question = getTriggeredQuestion(location, trigger)
    if (question) {
      incrementIntentionalCount()
      return question
    }
    return null
  }

  return {
    getTriggeredQuestion,
    getIntentionalQuestion,
    getAmbientQuestion,
    markSeen,
    saveAnswer,
    shouldRest,
  }
}