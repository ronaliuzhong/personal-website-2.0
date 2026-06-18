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

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  function handleExit() {
    setVisible(false)
    playTransition()
    setTimeout(onExit, 600)
  }

  const Interior = locationComponents[locationId]

  return (
    <div className={`location-screen ${visible ? 'visible' : ''}`}>
      <button className="back-button" onClick={handleExit}>
        ← back to the map
      </button>
      {Interior && <Interior />}
    </div>
  )
}

export default LocationScreen