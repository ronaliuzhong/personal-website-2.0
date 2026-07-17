import './ResumeWindow.css'

function ResumeWindow({ onClose }) {
  function handleDownload() {
    window.open('/RonaLiu-Zhong_resume.pdf', '_blank')
  }

  return (
    <div className="resume-window">
      <div className="resume-window__titlebar">
        <span className="resume-window__title">RonaLiu-Zhong_resume.pdf</span>
        <div className="resume-window__controls">
          <button className="resume-window__btn" onClick={handleDownload}>↓ download</button>
          <button className="resume-window__close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="resume-window__body">
        <iframe
          src="/RonaLiu-Zhong_resume.pdf"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  )
}

export default ResumeWindow