function TownDetails() {
  return (
    <g id="town-details">
      {/* lamp posts */}
      <line x1="296" y1="352" x2="296" y2="376" stroke="#888780" strokeWidth="2"/>
      <circle cx="296" cy="350" r="4" fill="#FAC775" opacity="0.78"/>
      <line x1="228" y1="312" x2="228" y2="336" stroke="#888780" strokeWidth="2"/>
      <circle cx="228" cy="310" r="4" fill="#FAC775" opacity="0.78"/>
      {/* bench */}
      <rect x="148" y="254" width="20" height="6" rx="2" fill="#EF9F27" opacity="0.48"/>
      <line x1="151" y1="260" x2="151" y2="266" stroke="#EF9F27" strokeWidth="1.5" opacity="0.48"/>
      <line x1="165" y1="260" x2="165" y2="266" stroke="#EF9F27" strokeWidth="1.5" opacity="0.48"/>
      {/* garden plot */}
      <rect x="100" y="240" width="30" height="20" rx="2" fill="#97C459" opacity="0.2" stroke="#3B6D11" strokeWidth="0.5"/>
      <line x1="115" y1="240" x2="115" y2="260" stroke="#3B6D11" strokeWidth="0.5" opacity="0.38"/>
      <line x1="100" y1="250" x2="130" y2="250" stroke="#3B6D11" strokeWidth="0.5" opacity="0.38"/>
      {/* fountain */}
      <circle cx="288" cy="354" r="10" fill="none" stroke="#B5D4F4" strokeWidth="2"/>
      <circle cx="288" cy="354" r="4" fill="#B5D4F4" opacity="0.58"/>
      {/* market stall */}
      <rect x="346" y="350" width="34" height="20" rx="2" fill="#FAC775" opacity="0.26" stroke="#EF9F27" strokeWidth="0.5"/>
      <line x1="346" y1="350" x2="380" y2="350" stroke="#EF9F27" strokeWidth="3" opacity="0.42" strokeLinecap="round"/>
      <line x1="363" y1="340" x2="363" y2="370" stroke="#EF9F27" strokeWidth="1.5" opacity="0.32"/>
      {/* water tower */}
      <rect x="394" y="298" width="16" height="20" rx="2" fill="#D3D1C7" opacity="0.52"/>
      <ellipse cx="402" cy="298" rx="12" ry="7" fill="#B4B2A9" opacity="0.52"/>
      <line x1="394" y1="318" x2="388" y2="330" stroke="#888780" strokeWidth="1.5" opacity="0.48"/>
      <line x1="410" y1="318" x2="416" y2="330" stroke="#888780" strokeWidth="1.5" opacity="0.48"/>
      {/* telescope on overlook */}
      <line x1="524" y1="114" x2="538" y2="104" stroke="#444441" strokeWidth="2" opacity="0.52"/>
      <circle cx="524" cy="116" r="4" fill="#444441" opacity="0.42"/>
    </g>
  )
}

export default TownDetails