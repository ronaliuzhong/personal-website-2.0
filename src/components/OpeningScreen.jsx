import './OpeningScreen.css'

function OpeningScreen({ onEnter }) {
  return (
    <div className="opening" onClick={onEnter}>
      <h1 className="opening-name">RONA LIU-ZHONG</h1>
      <p className="opening-hint">click anywhere to begin</p>
    </div>
  )
}

export default OpeningScreen