import { useState, useEffect } from 'react'
import { useQuestions } from '../../hooks/useQuestions'
import { useSounds } from '../../hooks/useSounds'
import QuestionCard from '../QuestionCard'
import './OverlookScreen.css'

const SIMPLE_JOYS = [
  'a perfect cup of coffee',
  'the first warm day of spring',
  'a song you forgot you loved',
  'laughing until it hurts',
  'finding the perfect seat',
  'the smell of rain on pavement',
  'a beautiful view that stops you',
  'when a stranger smiles at you',
  'finishing something you started',
  'golden hour light',
]

const MOON_COOLDOWN_MS = 2 * 60 * 60 * 1000

const lightPositions = [
  { cx: 140, cy: 248 },
  { cx: 185, cy: 253 },
  { cx: 230, cy: 248 },
  { cx: 275, cy: 244 },
  { cx: 320, cy: 241 },
  { cx: 365, cy: 241 },
  { cx: 410, cy: 243 },
  { cx: 455, cy: 247 },
  { cx: 500, cy: 248 },
  { cx: 540, cy: 243 },
]

const flowerOptions = [
  { id: 'pink', emoji: '🌸', label: 'pink blossom' },
  { id: 'red', emoji: '🌹', label: 'red rose' },
  { id: 'green', emoji: '🌿', label: 'green sprig' },
  { id: 'tulip', emoji: '🌷', label: 'tulip' },
  { id: 'peony', emoji: '💐', label: 'peony' },
  { id: 'daisy', emoji: '🌼', label: 'daisy' },
]

const flowerColors = {
  pink: '#ED93B1',
  red: '#D85A30',
  green: '#97C459',
  tulip: '#ED93B1',
  peony: '#D4537E',
  daisy: '#FAC775',
}

export default function OverlookScreen() {
  const [hoveredLight, setHoveredLight] = useState(null)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [showBouquet, setShowBouquet] = useState(false)
  const [showBook, setShowBook] = useState(false)
  const [moonGlowing, setMoonGlowing] = useState(false)
  const { getTriggeredQuestion, getSeenQuestions, markSeen, saveAnswer } = useQuestions()
  const { playClick, playEnter } = useSounds()

  function getMoonQuestion() {
    return getTriggeredQuestion('overlook', 'moon')
  }

  function isMoonReady() {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    const lastMoon = visitor.lastMoonQuestion
    if (lastMoon && Date.now() - lastMoon < MOON_COOLDOWN_MS) return false
    return getMoonQuestion() !== null
  }

  useEffect(() => {
    setMoonGlowing(isMoonReady())
  }, [])

  function handleMoonClick() {
    if (!moonGlowing) return
    playEnter()
    const question = getMoonQuestion()
    if (question) {
      const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
      localStorage.setItem('visitor', JSON.stringify({
        ...visitor,
        lastMoonQuestion: Date.now(),
      }))
      setActiveQuestion(question)
      setMoonGlowing(false)
    }
  }

  function handleBouquetClick() {
    playClick()
    setShowBouquet(true)
    setActiveQuestion({
      id: 'overlook_flower',
      text: 'What flower would your favorite person pick?',
      inputType: 'choice',
      options: flowerOptions.map(f => f.emoji),
    })
  }

  function handleBookClick() {
    playClick()
    setShowBook(true)
  }

  function handleCloseQuestion() {
    setActiveQuestion(null)
    setShowBouquet(false)
  }

  const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
  const myFlowerEmoji = visitor.answers?.cafe_t1
  const theirFlowerEmoji = visitor.answers?.overlook_flower
  const myColor = myFlowerEmoji
    ? flowerColors[flowerOptions.find(f => f.emoji === myFlowerEmoji)?.id] || 'white'
    : 'white'
  const theirColor = theirFlowerEmoji
    ? flowerColors[flowerOptions.find(f => f.emoji === theirFlowerEmoji)?.id] || 'white'
    : 'white'
  const bouquetColors = [myColor, theirColor, myColor, theirColor, myColor]

  return (
    <div className="overlook-screen">
      <svg
        viewBox="0 0 680 420"
        className="overlook-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* sky */}
        <rect width="680" height="420" fill="#0d0d1a"/>
        <rect width="680" height="420" fill="#1a1235" opacity="0.9"/>
        <rect width="680" height="320" fill="#2d1b4e" opacity="0.6"/>
        <rect width="680" height="220" fill="#4a1942" opacity="0.45"/>
        <rect width="680" height="150" fill="#8B3a3a" opacity="0.38"/>
        <rect width="680" height="90" fill="#C4704A" opacity="0.4"/>
        <rect width="680" height="45" fill="#FAC775" opacity="0.28"/>
        <ellipse cx="340" cy="310" rx="320" ry="65" fill="#FAC775" opacity="0.1"/>

        {/* stars */}
        {[
          [80,35],[140,20],[200,50],[260,25],[320,14],[390,38],[450,18],
          [510,45],[570,22],[620,40],[650,15],[30,60],[110,75],[170,68],
          [300,70],[420,78],[540,85],[600,58],[50,110],[250,105],[550,108],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.5 + (i % 4) * 0.1}/>
        ))}

        {/* MOON */}
        <circle cx="575" cy="68" r="24" fill="#FAC775" opacity="0.6"/>
        <circle cx="586" cy="63" r="20" fill="#0d0d1a" opacity="0.9"/>
        {moonGlowing && (
          <>
            <circle cx="575" cy="68" r="32" fill="#FAC775" opacity="0.08"/>
            <circle cx="575" cy="68" r="40" fill="#FAC775" opacity="0.04"/>
          </>
        )}
        <circle
          cx="575" cy="68" r="24"
          fill="transparent"
          style={{ cursor: moonGlowing ? 'pointer' : 'default' }}
          onClick={handleMoonClick}
        />

        {/* birds */}
        <path d="M210 155 Q218 149 226 155" stroke="#1a1235" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M226 155 Q234 149 242 155" stroke="#1a1235" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M255 132 Q261 127 267 132" stroke="#1a1235" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M267 132 Q273 127 279 132" stroke="#1a1235" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M290 118 Q294 114 298 118" stroke="#1a1235" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M298 118 Q302 114 306 118" stroke="#1a1235" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

        {/* water */}
        <rect x="0" y="295" width="680" height="22" fill="#1a2d4a" opacity="0.7"/>
        <rect x="40" y="299" width="140" height="3" rx="1" fill="#B5D4F4" opacity="0.2"/>
        <rect x="260" y="302" width="100" height="2" rx="1" fill="#B5D4F4" opacity="0.18"/>
        <rect x="440" y="298" width="130" height="3" rx="1" fill="#B5D4F4" opacity="0.2"/>

        {/* hill */}
        <rect x="0" y="315" width="680" height="105" fill="#152e15"/>
        <ellipse cx="340" cy="315" rx="340" ry="45" fill="#1a3a1a"/>
        <ellipse cx="340" cy="313" rx="330" ry="38" fill="#1e3d1e"/>

        {/* trees */}
        <rect x="94" y="262" width="10" height="90" rx="2" fill="#0a1a0a"/>
        <ellipse cx="99" cy="248" rx="34" ry="40" fill="#0a1a0a"/>
        <ellipse cx="99" cy="236" rx="24" ry="28" fill="#111f11" opacity="0.9"/>
        <rect x="574" y="268" width="10" height="84" rx="2" fill="#0a1a0a"/>
        <ellipse cx="579" cy="254" rx="32" ry="38" fill="#0a1a0a"/>
        <ellipse cx="579" cy="243" rx="22" ry="26" fill="#111f11" opacity="0.9"/>

        {/* STRING LIGHTS */}
        <path d="M99 228 Q180 255 260 242 Q340 232 420 242 Q500 252 579 232" stroke="#888780" strokeWidth="1" fill="none" opacity="0.5"/>
        {lightPositions.map((pos, i) => (
          <g key={i}
            onMouseEnter={() => setHoveredLight(i)}
            onMouseLeave={() => setHoveredLight(null)}
            style={{ cursor: 'pointer' }}
          >
            {hoveredLight === i && (
              <ellipse cx={pos.cx} cy={pos.cy + 4} rx="16" ry="10" fill="#FAC775" opacity="0.15"/>
            )}
            <circle cx={pos.cx} cy={pos.cy} r={hoveredLight === i ? 6 : 4} fill="#FAC775" opacity="0.9"/>
            <ellipse cx={pos.cx} cy={pos.cy + 4} rx="3" ry="5" fill="#FAC775" opacity="0.2"/>
          </g>
        ))}

        {/* lamp posts */}
        <rect x="188" y="295" width="5" height="65" rx="1" fill="#444441"/>
        <path d="M193 295 Q205 285 215 290" stroke="#444441" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="216" cy="291" r="6" fill="#FAC775" opacity="0.85"/>
        <ellipse cx="216" cy="297" rx="12" ry="8" fill="#FAC775" opacity="0.12"/>
        <rect x="487" y="295" width="5" height="65" rx="1" fill="#444441"/>
        <path d="M487 295 Q475 285 465 290" stroke="#444441" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="464" cy="291" r="6" fill="#FAC775" opacity="0.85"/>
        <ellipse cx="464" cy="297" rx="12" ry="8" fill="#FAC775" opacity="0.12"/>

        {/* bench */}
        <rect x="268" y="332" width="144" height="7" rx="2" fill="#1e3d0e" opacity="0.95"/>
        <rect x="268" y="322" width="144" height="6" rx="2" fill="#27500A" opacity="0.8"/>
        <rect x="276" y="339" width="7" height="20" rx="2" fill="#152e15"/>
        <rect x="397" y="339" width="7" height="20" rx="2" fill="#152e15"/>
        <rect x="266" y="321" width="5" height="28" rx="2" fill="#0d1f0d"/>
        <rect x="409" y="321" width="5" height="28" rx="2" fill="#0d1f0d"/>

        {/* FIGURE */}
        <g style={{ cursor: 'pointer' }} onClick={() => {}}>
          <circle cx="300" cy="310" r="10" fill="#0a1a0a"/>
          <rect x="292" y="320" width="18" height="14" rx="3" fill="#0a1a0a"/>
          <rect x="292" y="332" width="8" height="6" rx="1" fill="#0a1a0a"/>
          <rect x="302" y="332" width="8" height="6" rx="1" fill="#0a1a0a"/>
        </g>

        {/* BOUQUET */}
        <g style={{ cursor: 'pointer' }} onClick={handleBouquetClick}>
          <line x1="348" y1="334" x2="345" y2="324" stroke="#27500A" strokeWidth="1.2" opacity="0.9"/>
          <line x1="352" y1="334" x2="352" y2="322" stroke="#27500A" strokeWidth="1.2" opacity="0.9"/>
          <line x1="356" y1="334" x2="358" y2="324" stroke="#27500A" strokeWidth="1.2" opacity="0.9"/>
          <rect x="344" y="330" width="16" height="6" rx="2" fill="#F5F0E8" opacity="0.55"/>
          {bouquetColors.map((color, i) => {
            const positions = [
              { cx: 345, cy: 322 }, { cx: 352, cy: 319 }, { cx: 359, cy: 322 },
              { cx: 348, cy: 316 }, { cx: 356, cy: 316 },
            ]
            return (
              <g key={i}>
                <circle cx={positions[i].cx} cy={positions[i].cy} r={i === 1 ? 4.5 : 4} fill={color} opacity="0.85"/>
                <circle cx={positions[i].cx} cy={positions[i].cy} r="1.5" fill="#FAC775" opacity="0.8"/>
              </g>
            )
          })}
        </g>

        {/* BOOK */}
        <g style={{ cursor: 'pointer' }} onClick={handleBookClick}>
          <rect x="368" y="326" width="20" height="14" rx="2" fill="#FAC775" opacity="0.85"/>
          <rect x="369" y="327" width="18" height="12" rx="1" fill="#EF9F27" opacity="0.5"/>
          <rect x="368" y="326" width="3" height="14" rx="1" fill="#BA7517" opacity="0.8"/>
          <line x1="372" y1="329" x2="386" y2="329" stroke="#BA7517" strokeWidth="0.5" opacity="0.5"/>
          <line x1="372" y1="332" x2="386" y2="332" stroke="#BA7517" strokeWidth="0.5" opacity="0.5"/>
          <line x1="372" y1="335" x2="386" y2="335" stroke="#BA7517" strokeWidth="0.5" opacity="0.5"/>
        </g>

        {/* wildflowers */}
        {[
          [28,348,'#ED93B1'],[45,358,'#FAC775'],[38,342,'white'],[18,362,'#ED93B1'],[58,345,'#FAC775'],
          [88,353,'#FAC775'],[102,344,'#ED93B1'],[76,362,'white'],[115,357,'#FAC775'],
          [148,347,'white'],[163,358,'#FAC775'],[175,342,'#ED93B1'],[188,365,'white'],
          [488,350,'#ED93B1'],[502,362,'white'],[515,344,'#FAC775'],[476,358,'#ED93B1'],
          [562,355,'#FAC775'],[578,346,'#ED93B1'],[550,363,'white'],
          [618,352,'white'],[634,344,'#FAC775'],[648,358,'#ED93B1'],[658,348,'white'],
        ].map(([x, y, color], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i % 3 === 0 ? 3.5 : i % 3 === 1 ? 2.5 : 3} fill={color} opacity="0.75"/>
            <line x1={x} y1={y + 3} x2={x - 1} y2={y + 15} stroke="#27500A" strokeWidth="1.5" opacity="0.7"/>
          </g>
        ))}

      </svg>

      {/* hovered light joy tooltip */}
      {hoveredLight !== null && (
        <div
          className="overlook-joy"
          style={{
            left: `${(lightPositions[hoveredLight].cx / 680) * 100}%`,
            top: `${(lightPositions[hoveredLight].cy / 420) * 100}%`,
          }}
        >
          {SIMPLE_JOYS[hoveredLight]}
        </div>
      )}

      {/* book modal */}
      {showBook && (
        <div className="overlook-book-overlay" onClick={() => setShowBook(false)}>
          <div className="overlook-book" onClick={e => e.stopPropagation()}>
            <button className="overlook-book__close" onClick={() => setShowBook(false)}>×</button>
            <p className="overlook-book__title">on happiness</p>
            <div className="overlook-book__body">
              <p>[ your happiness essay will go here ]</p>
            </div>
          </div>
        </div>
      )}

      {/* question card */}
      {activeQuestion && (
        <QuestionCard
          question={activeQuestion}
          location="overlook"
          onClose={handleCloseQuestion}
        />
      )}

    </div>
  )
}