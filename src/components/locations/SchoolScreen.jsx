import { useState } from 'react'
import { useQuestions } from '../../hooks/useQuestions'
import { useSounds } from '../../hooks/useSounds'
import QuestionCard from '../QuestionCard'
import ResumeWindow from './school/ResumeWindow'
import LaytonWindow from './school/LaytonWindow'
import './SchoolScreen.css'
import ComingSoonWindow from './school/ComingSoonWindow'

const icons = [
  { id: 'resume', label: 'resume.pdf', tag: '[PDF]', tagColor: '#97C459' },
  { id: 'layton', label: 'layton/', tag: '[???]', tagColor: '#FAC775' },
  { id: 'question_exe', label: 'question.exe', tag: '[EXE]', tagColor: '#B5D4F4' },
  { id: 'projects', label: 'projects/', tag: '[DIR]', tagColor: '#ED93B1' },
  { id: 'freakonomics', label: 'freakonomics.exe', tag: '[WIP]', tagColor: '#D3D1C7' },
]

function SchoolScreen() {
  const [openWindow, setOpenWindow] = useState(null)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const { getTriggeredQuestion, getIntentionalQuestion } = useQuestions()
  const { playClick } = useSounds()

  function handleIconClick(id) {
    playClick()
    if (id === 'question_exe') {
      const result = getIntentionalQuestion('school', 'question_exe')
      if (result?.isRest) {
        setActiveQuestion({ isRest: true })
      } else if (result) {
        setActiveQuestion(result)
      }
    } else {
      setOpenWindow(id)
    }
  }

  function handleCloseWindow() {
    setOpenWindow(null)
  }

  function handleCloseQuestion() {
    setActiveQuestion(null)
  }

  return (
    <div className="school-screen">
      <div className="school-icons">
        {icons.map(icon => (
          <div
            key={icon.id}
            className="school-icon"
            onClick={() => handleIconClick(icon.id)}
          >
            <div
              className="school-icon__tag"
              style={{ borderColor: icon.tagColor, color: icon.tagColor }}
            >
              {icon.tag}
            </div>
            <div className="school-icon__label">{icon.label}</div>
          </div>
        ))}
      </div>

      <div className="school-taskbar">
        <div className="school-taskbar__start">⊞ RonalzOS</div>
        <div className="school-taskbar__time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {openWindow === 'resume' && <ResumeWindow onClose={handleCloseWindow} />}
      {openWindow === 'layton' && <LaytonWindow onClose={handleCloseWindow} />}
      {openWindow === 'projects' && <ComingSoonWindow title="projects/" onClose={handleCloseWindow} />}
      {openWindow === 'freakonomics' && <ComingSoonWindow title="freakonomics.exe" onClose={handleCloseWindow} />}

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