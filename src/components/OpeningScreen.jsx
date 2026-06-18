import { useSounds } from '../hooks/useSounds'
import './OpeningScreen.css'

function OpeningScreen({ onEnter }) {
  const { playEnter } = useSounds()

  function handleClick() {
    playEnter()
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