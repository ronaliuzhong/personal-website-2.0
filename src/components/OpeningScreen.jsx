import './OpeningScreen.css'

import { sounds } from '../utils/sounds'

function OpeningScreen({ onEnter }) {
  function handleClick() {
    sounds.chime()
    onEnter()
  }

  return (
    <div className="opening" onClick={handleClick}>
      <h1 className="opening-name">RONA LIU-ZHONG</h1>
      <p className="opening-hint">click anywhere to begin</p>
    </div>
  )
}

export default OpeningScreen