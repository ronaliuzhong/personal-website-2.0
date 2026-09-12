import { useState } from 'react'
import { useSounds } from '../../hooks/useSounds'
import ContactRona from '../locations/overlook/ContactRona'
import Ground from './Ground'
import Flowers from './Flowers'
import Bluff from './Bluff'
import Forest from './Forest'
import Stream from './Stream'
import Paths from './Paths'
import Trees from './Trees'
import TownDetails from './TownDetails'
import FieldDetails from './FieldDetails'
import './WorldMap.css'
import { COLORS } from '../../constants'

const locations = [
  {
    id: 'cafe',
    label: 'The Café',
    sub: 'reflection · reading',
    x: 200,
    y: 300,
    color: COLORS.amber,
    dotColor: '#BA7517',
  },
  {
    id: 'commons',
    label: 'The Commons',
    sub: 'community · people',
    x: 360,
    y: 400,
    color: COLORS.pink,
    dotColor: '#993556',
  },
  {
    id: 'school',
    label: 'The School',
    sub: 'code · projects',
    x: 400,
    y: 200,
    color: COLORS.blue,
    dotColor: '#185FA5',
  },
  {
    id: 'overlook',
    label: 'The Overlook',
    sub: 'joy · simple things',
    x: 560,
    y: 220,
    color: COLORS.midGreen,
    dotColor: COLORS.forestGreen,
  },
  {
    id: 'field',
    label: 'The Field',
    sub: 'movement · sport',
    x: 180,
    y: 460,
    color: COLORS.lightGreen,
    dotColor: COLORS.forestGreen,
  },
]

function LocationMarker({ loc, hovered, onHover, onLeave, onClick, pulse }) {
  const isHovered = hovered === loc.id

  return (
    <g
      className="location-group"
      onMouseEnter={() => onHover(loc.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(loc.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* pulsing ring — only shown for Café, only before it's ever been visited */}
      {pulse && (
        <circle
          className="location-pulse-ring"
          cx={loc.x}
          cy={loc.y}
          r={18}
          fill="none"
          stroke={loc.color}
          strokeWidth={3.5}
        />
      )}
      {/* outer ring */}
      <circle
        cx={loc.x}
        cy={loc.y}
        r={isHovered ? 22 : 18}
        fill={loc.color}
        opacity={isHovered ? 0.35 : 0.25}
        style={{ transition: 'all 0.2s ease' }}
      />
      {/* middle ring */}
      <circle
        cx={loc.x}
        cy={loc.y}
        r={isHovered ? 13 : 10}
        fill={loc.color}
        opacity={isHovered ? 0.55 : 0.4}
        style={{ transition: 'all 0.2s ease' }}
      />
      {/* center dot */}
      <circle
        cx={loc.x}
        cy={loc.y}
        r={4}
        fill={loc.color}
        opacity={0.9}
      />
      {/* label */}
      <text
        x={loc.x}
        y={loc.y - 28}
        textAnchor="middle"
        fontFamily="'Caveat Brush', cursive"
        fontSize="16"
        fill="#27500A"
        opacity={isHovered ? 1 : 0.85}
        style={{ transition: 'opacity 0.2s ease' }}
      >
        {loc.label}
      </text>
      {/* sublabel — only on hover */}
      {isHovered && (
        <text
          x={loc.x}
          y={loc.y - 14}
          textAnchor="middle"
          fontFamily="'DM Sans', sans-serif"
          fontSize="9"
          fill="#639922"
        >
          {loc.sub}
        </text>
      )}
    </g>
  )
}

function WorldMap({ name, returning, onEnterLocation }) {
  const [hovered, setHovered] = useState(null)
  // Checks for the flag TalkToRona's "reach the real me" button sets
  // right before navigating here — same lazy-initializer-checks-and-
  // clears-a-flag pattern LocationScreen's showHint already uses.
  const [showContact, setShowContact] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    if (visitor.pendingContactOpen) {
      localStorage.setItem('visitor', JSON.stringify({ ...visitor, pendingContactOpen: false }))
      return true
    }
    return false
  })
  const { playTransition } = useSounds()

  // Tracks whether Café has ever actually been visited — separate from
  // `returning`, since `returning` only flips true on a whole NEW
  // session. This stops the pulse the moment they click into Café,
  // even within their very first session, rather than waiting for a
  // future visit.
  const [cafeVisited, setCafeVisited] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    return !!visitor.cafeVisited
  })

  function handleEnterLocation(id) {
    playTransition()
    if (id === 'cafe' && !cafeVisited) {
      const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
      localStorage.setItem('visitor', JSON.stringify({ ...visitor, cafeVisited: true }))
      setCafeVisited(true)
    }
    onEnterLocation(id)
  }

  return (
    <div className="worldmap-container">
      <svg
        viewBox="0 0 680 580"
        className="worldmap-svg"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <rect width="680" height="580" fill="#F5F0E8"/>

        <Ground />
        <Bluff />
        <Forest />
        <Stream />
        <Paths />
        <Trees />
        <Flowers />
        <TownDetails />
        <FieldDetails />

        <text
          x="340"
          y="38"
          textAnchor="middle"
          fontFamily="'Caveat Brush', cursive"
          fontSize="22"
          fill="#27500A"
        >
          Rona's Corner
        </text>

        {locations.map(loc => (
          <LocationMarker
            key={loc.id}
            loc={loc}
            hovered={hovered}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
            onClick={handleEnterLocation}
            pulse={loc.id === 'cafe' && !returning && !cafeVisited}
          />
        ))}

        {/* Quiet site utility, deliberately NOT styled like a 6th
            location — no glow, no connecting path, tucked into open
            space away from the constellation of circles entirely, so
            it reads as "a way to reach me" rather than "a place in
            Rona's life." Same font family as the title/labels, just
            much smaller and more muted, so it feels like part of the
            considered layout rather than a bolted-on UI element. */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => setShowContact(true)}
        >
          <circle cx="662" cy="558" r="3" fill="#888780" opacity="0.6"/>
          <text
            x="654"
            y="562"
            textAnchor="end"
            fontFamily="'Caveat Brush', cursive"
            fontSize="19"
            fill="#888780"
          >
            contact me
          </text>
        </g>
      </svg>

      {showContact && (
        <div className="worldmap-contact-overlay" onClick={() => setShowContact(false)}>
          <div className="worldmap-contact-modal" onClick={e => e.stopPropagation()}>
            <button className="worldmap-contact-modal__close" onClick={() => setShowContact(false)}>×</button>
            <p className="worldmap-contact-modal__title">contact me</p>
            <ContactRona onBack={() => setShowContact(false)} backLabel="close" />
          </div>
        </div>
      )}

      {returning && (
        <div className="worldmap-greeting">
          Welcome back, {name}.
        </div>
      )}
    </div>
  )
}

export default WorldMap