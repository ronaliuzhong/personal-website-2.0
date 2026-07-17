import { useState } from 'react'
import { useSounds } from '../../hooks/useSounds'
import Ground from './Ground'
import Beach from './Beach'
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

function LocationMarker({ loc, hovered, onHover, onLeave, onClick }) {
  const isHovered = hovered === loc.id

  return (
    <g
      className="location-group"
      onMouseEnter={() => onHover(loc.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(loc.id)}
      style={{ cursor: 'pointer' }}
    >
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
  const { playTransition } = useSounds()

  function handleEnterLocation(id) {
    playTransition()
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
        <Beach />
        <Bluff />
        <Forest />
        <Stream />
        <Paths />
        <Trees />
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
          Rona's World
        </text>

        {locations.map(loc => (
          <LocationMarker
            key={loc.id}
            loc={loc}
            hovered={hovered}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
            onClick={handleEnterLocation}
          />
        ))}
      </svg>

      {returning && (
        <div className="worldmap-greeting">
          Welcome back, {name}.
        </div>
      )}
    </div>
  )
}

export default WorldMap