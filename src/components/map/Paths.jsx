function Paths() {
  return (
    <g id="paths">
      {/* café to field */}
      <path d="M200 300 Q188 380 180 460" stroke="#E0D8C8" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* café to commons */}
      <path d="M200 300 Q280 350 360 400" stroke="#E0D8C8" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* café to school */}
      <path d="M200 300 Q300 250 400 200" stroke="#E0D8C8" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* school to overlook */}
      <path d="M400 200 Q480 210 560 220" stroke="#E0D8C8" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* commons to overlook — lower road */}
      <path d="M360 400 Q460 340 560 220" stroke="#E0D8C8" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6"/>
    </g>
  )
}

export default Paths