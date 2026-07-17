import './LaytonWindow.css'

function LaytonWindow({ onClose }) {
  return (
    <div className="layton-window">
      <div className="layton-window__titlebar">
        <span className="layton-window__title">professor_layton/</span>
        <button className="layton-window__close" onClick={onClose}>×</button>
      </div>
      <div className="layton-window__body">
        <p className="layton-window__coming">coming soon...</p>
      </div>
    </div>
  )
}

export default LaytonWindow