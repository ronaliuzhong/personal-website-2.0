import { useEffect, useState } from 'react'
import { useSounds } from '../../hooks/useSounds'
import './LocationScreen.css'
import CafeScreen from './CafeScreen'
import CommonsScreen from './CommonsScreen'
import SchoolScreen from './SchoolScreen'
import OverlookScreen from './OverlookScreen'
import FieldScreen from './FieldScreen'

const locationComponents = {
  cafe: CafeScreen,
  commons: CommonsScreen,
  school: SchoolScreen,
  overlook: OverlookScreen,
  field: FieldScreen,
}

function LocationScreen({ locationId, onExit }) {
  const [visible, setVisible] = useState(false)
  const { playTransition } = useSounds()

  // Shows a one-time "this is interactive" hint inside whichever
  // location a visitor enters first, ever — gated on a single global
  // flag (not per-location), since it only needs to teach the pattern
  // once, not repeat it in every room.
  const [showHint, setShowHint] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    return !visitor.hasSeenLocationHint
  })

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  function handleExit() {
    setVisible(false)
    playTransition()
    setTimeout(onExit, 600)
  }

  // Dismisses the hint the moment the visitor clicks anything at all
  // inside the location — the click still fires normally on whatever
  // was actually clicked underneath, since this only listens via
  // bubbling and never blocks or intercepts the click itself.
  function handleFirstInteraction() {
    if (!showHint) return
    setShowHint(false)
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    localStorage.setItem('visitor', JSON.stringify({ ...visitor, hasSeenLocationHint: true }))
  }

  const Interior = locationComponents[locationId]

  return (
    <div
      className={`location-screen ${visible ? 'visible' : ''}`}
      onClick={handleFirstInteraction}
    >
      <button
        className={`back-button ${locationId === 'field' ? 'back-button--high-contrast' : ''}`}
        onClick={handleExit}
      >
        ← back to the map
      </button>
      {Interior && <Interior />}
      {showHint && (
        <div className="location-hint">
          this world is interactive—click around to explore
        </div>
      )}
    </div>
  )
}

export default LocationScreen