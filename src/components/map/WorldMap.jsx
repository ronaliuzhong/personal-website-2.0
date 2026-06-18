import { useState } from 'react'
import './WorldMap.css'
import Ground from './Ground'
import Beach from './Beach'
import Bluff from './Bluff'
import Forest from './Forest'
import Stream from './Stream'
import Paths from './Paths'
import Trees from './Trees'
import TownDetails from './TownDetails'
import FieldDetails from './FieldDetails'

const locations = [
  { id: 'cafe', label: 'The Café', sub: 'reflection · reading', x: 112, y: 166, color: '#FAC775' },
  { id: 'commons', label: 'The Commons', sub: 'community · people', x: 238, y: 250, color: '#ED93B1' },
  { id: 'school', label: 'The School', sub: 'code · projects', x: 262, y: 90, color: '#B5D4F4' },
  { id: 'overlook', label: 'The Overlook', sub: 'simple happinesses', x: 474, y: 64, color: '#97C459' },
  { id: 'field', label: 'The Field', sub: 'movement · sport', x: 64, y: 390, color: '#C0DD97' },
]

function WorldMap({ name, onEnterLocation }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="worldmap-container">
      <svg
        viewBox="0 0 680 580"
        className="worldmap-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* background */}
        <rect width="680" height="580" fill="#EAF3DE"/>

        {/* we'll add all decorative elements next */}
        <Ground />
        <Beach />
        <Bluff />
        <Forest />
        <Stream />
        <Paths />
        <Trees />
        <TownDetails />
        <FieldDetails />

        {/* title */}
        <text x="330" y="38" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="22" fill="#27500A">Rona's World</text>

        {/* clickable locations */}
        {locations.map((loc) => (
          <g
            key={loc.id}
            className="location-group"
            transform={`translate(${loc.x}, ${loc.y}) scale(${hovered === loc.id ? 1.05 : 1})`}
            style={{ transformOrigin: `${loc.x + 61}px ${loc.y + 45}px` }}
            onMouseEnter={() => setHovered(loc.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onEnterLocation(loc.id)}
          >
            <rect
              width="122"
              height="94"
              rx="10"
              fill="#FAFAF8"
              stroke={hovered === loc.id ? loc.color : loc.color}
              strokeWidth={hovered === loc.id ? 2.5 : 1.5}
            />
            <text
              x="61"
              y="52"
              textAnchor="middle"
              fontFamily="'Caveat Brush', cursive"
              fontSize="16"
              fill="#27500A"
            >{loc.label}</text>
            <text
              x="61"
              y="68"
              textAnchor="middle"
              fontFamily="'DM Sans', sans-serif"
              fontSize="11"
              fill="#3B6D11"
            >{loc.sub}</text>

          </g>
        ))}
      </svg>

      {/* welcome back name top center */}
      <div className="worldmap-greeting">
        welcome back, {name}.
      </div>
    </div>
  )
}

export default WorldMap