function FieldDetails() {
  return (
    <g id="field-details">
      {/* equipment shed */}
      <rect x="110" y="438" width="26" height="18" rx="2" fill="#D3D1C7" opacity="0.48" stroke="#888780" strokeWidth="0.5"/>
      <polygon points="110,438 136,438 123,428" fill="#B4B2A9" opacity="0.48"/>
      {/* bleachers */}
      <rect x="70" y="438" width="32" height="12" rx="2" fill="#D3D1C7" opacity="0.38"/>
      <line x1="70" y1="442" x2="102" y2="442" stroke="#888780" strokeWidth="0.5"/>
      <line x1="70" y1="446" x2="102" y2="446" stroke="#888780" strokeWidth="0.5"/>
      {/* playground */}
      <line x1="198" y1="390" x2="198" y2="416" stroke="#EF9F27" strokeWidth="1.5" opacity="0.6"/>
      <line x1="214" y1="390" x2="214" y2="416" stroke="#EF9F27" strokeWidth="1.5" opacity="0.6"/>
      <line x1="194" y1="390" x2="218" y2="390" stroke="#EF9F27" strokeWidth="2" opacity="0.6"/>
      <line x1="202" y1="390" x2="206" y2="408" stroke="#888780" strokeWidth="1" opacity="0.5"/>
      <circle cx="204" cy="410" r="4" fill="#D4537E" opacity="0.5"/>
      <line x1="228" y1="388" x2="228" y2="410" stroke="#EF9F27" strokeWidth="2" opacity="0.55"/>
      <line x1="228" y1="388" x2="244" y2="410" stroke="#378ADD" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
      <circle cx="258" cy="406" r="10" fill="none" stroke="#97C459" strokeWidth="2" opacity="0.55"/>
      <circle cx="258" cy="406" r="3" fill="#97C459" opacity="0.45"/>
      <text x="224" y="428" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#27500A" opacity="0.65">playground</text>
    </g>
  )
}

export default FieldDetails