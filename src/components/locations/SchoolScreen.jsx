import { useState } from 'react'
import { useQuestions } from '../../hooks/useQuestions'
import QuestionCard from '../QuestionCard'
import './SchoolScreen.css'

function SchoolScreen() {
  const [activeQuestion, setActiveQuestion] = useState(null)
  const { getTriggeredQuestion } = useQuestions()

  function handleTrigger(trigger) {
    const question = getTriggeredQuestion('school', trigger)
    if (question) setActiveQuestion(question)
  }

  function handleCloseQuestion() {
    setActiveQuestion(null)
  }

  return (
    <div className="school-screen">
      <p className="school-screen__placeholder">School interior coming soon</p>

      {/* test trigger button */}
      <button
        className="school-screen__test-btn"
        onClick={() => handleTrigger('projects')}
      >
        click me to test question card
      </button>

      {activeQuestion && (
        <QuestionCard
          question={activeQuestion}
          location="school"
          onClose={handleCloseQuestion}
        />
      )}
    </div>
  )
}

export default SchoolScreen