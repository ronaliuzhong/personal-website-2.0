import './ComingSoonWindow.css'

function ComingSoonWindow({ title, onClose }) {
  return (
    <div className="coming-soon-window">
      <div className="coming-soon-window__titlebar">
        <span className="coming-soon-window__title">{title}</span>
        <button className="coming-soon-window__close" onClick={onClose}>×</button>
      </div>
      <div className="coming-soon-window__body">
        <p className="coming-soon-window__text">under construction</p>
        <p className="coming-soon-window__subtext">check back soon.</p>
      </div>
    </div>
  )
}

export default ComingSoonWindow