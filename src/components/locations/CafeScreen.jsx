import { useState } from 'react'
import { useQuestions } from '../../hooks/useQuestions'
import { useSounds } from '../../hooks/useSounds'
import { cafeBooks } from '../../data/cafeBooks'
import QuestionCard from '../QuestionCard'
import BookModal from './cafe/BookModal'
import './CafeScreen.css'
import CommunityJournal from './cafe/CommunityJournal'


const drinks = [
  { id: 'coffee', label: 'coffee', color: '#6B3E1E' },
  { id: 'tea', label: 'tea', color: '#C4850A' },
  { id: 'water', label: 'water', color: '#B5D4F4' },
  { id: 'juice', label: 'juice', color: '#EF9F27' },
  { id: 'milk', label: 'milk', color: '#F5F0E8' },
]

function CafeScreen() {
  const [activeBook, setActiveBook] = useState(null)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [hoveredBook, setHoveredBook] = useState(null)
  const [showDrinkPicker, setShowDrinkPicker] = useState(false)
  const [drinkChoice, setDrinkChoice] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    return drinks.find(d => d.id === visitor.drink) || drinks[0]
  })
  const { getTriggeredQuestion } = useQuestions()
  const { playClick } = useSounds()
  const [showJournal, setShowJournal] = useState(false)


  function handleBookClick(book) {
    playClick()
    setActiveBook(book)
  }

  function handleCupClick() {
    playClick()
    setShowDrinkPicker(true)
  }

  function handleDrinkChoice(drink) {
    setDrinkChoice(drink)
    setShowDrinkPicker(false)
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    localStorage.setItem('visitor', JSON.stringify({ ...visitor, drink: drink.id }))
  }

  function handleJournalClick() {
    playClick()
    setShowJournal(true)
  }

  function handleCloseBook() {
    setActiveBook(null)
  }

  function handleCloseQuestion() {
    setActiveQuestion(null)
  }

  const hoveredBookData = cafeBooks.find(b => b.id === hoveredBook)

  return (
    <div className="cafe-screen">
      <svg
        viewBox="0 0 680 400"
        className="cafe-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* wall */}
        <rect width="680" height="400" fill="#F5F0E8"/>

        {/* floor */}
        <rect x="0" y="300" width="680" height="100" fill="#E8DFD0"/>
        <line x1="0" y1="320" x2="680" y2="320" stroke="#D8CFC0" strokeWidth="1"/>
        <line x1="0" y1="340" x2="680" y2="340" stroke="#D8CFC0" strokeWidth="1"/>
        <line x1="0" y1="360" x2="680" y2="360" stroke="#D8CFC0" strokeWidth="1"/>
        <line x1="0" y1="380" x2="680" y2="380" stroke="#D8CFC0" strokeWidth="1"/>
        <line x1="120" y1="300" x2="120" y2="400" stroke="#D8CFC0" strokeWidth="0.5"/>
        <line x1="240" y1="300" x2="240" y2="400" stroke="#D8CFC0" strokeWidth="0.5"/>
        <line x1="360" y1="300" x2="360" y2="400" stroke="#D8CFC0" strokeWidth="0.5"/>
        <line x1="480" y1="300" x2="480" y2="400" stroke="#D8CFC0" strokeWidth="0.5"/>
        <line x1="600" y1="300" x2="600" y2="400" stroke="#D8CFC0" strokeWidth="0.5"/>

        {/* LEFT BOOKSHELF */}
        <rect x="20" y="40" width="160" height="260" rx="2" fill="#C4956A" opacity="0.4"/>
        <rect x="20" y="40" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="20" y="110" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="20" y="180" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="20" y="250" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="20" y="294" width="160" height="6" rx="1" fill="#A0724A"/>

        {/* left books row 1 — decorative */}
        <rect x="28" y="52" width="14" height="58" rx="1" fill="#D4537E" opacity="0.5"/>
        <rect x="44" y="56" width="10" height="54" rx="1" fill="#378ADD"/>
        <rect x="56" y="52" width="16" height="58" rx="1" fill="#27500A"/>
        <rect x="74" y="58" width="12" height="52" rx="1" fill="#FAC775"/>
        <rect x="88" y="52" width="14" height="58" rx="1" fill="#7A9E7E"/>
        <rect x="104" y="56" width="10" height="54" rx="1" fill="#C4956A"/>
        <rect x="116" y="52" width="18" height="58" rx="1" fill="#ED93B1"/>
        <rect x="136" y="56" width="12" height="54" rx="1" fill="#3B6D11"/>
        <rect x="150" y="52" width="14" height="58" rx="1" fill="#B5D4F4"/>

        {/* left books row 2 — decorative */}
        <rect x="28" y="122" width="12" height="58" rx="1" fill="#FAC775"/>
        <rect x="42" y="126" width="16" height="54" rx="1" fill="#27500A"/>
        <rect x="60" y="122" width="10" height="58" rx="1" fill="#D4537E"/>
        <rect x="72" y="126" width="14" height="54" rx="1" fill="#378ADD" opacity="0.5"/>
        <rect x="88" y="122" width="18" height="58" rx="1" fill="#C4956A"/>
        <rect x="108" y="126" width="12" height="54" rx="1" fill="#7A9E7E"/>
        <rect x="122" y="122" width="14" height="58" rx="1" fill="#ED93B1"/>
        <rect x="138" y="126" width="10" height="54" rx="1" fill="#B5D4F4"/>
        <rect x="150" y="122" width="14" height="58" rx="1" fill="#3B6D11"/>

        {/* left books row 3 — decorative */}
        <rect x="28" y="192" width="16" height="58" rx="1" fill="#378ADD"/>
        <rect x="46" y="196" width="12" height="54" rx="1" fill="#ED93B1"/>
        <rect x="60" y="192" width="14" height="58" rx="1" fill="#FAC775"/>
        <rect x="76" y="196" width="10" height="54" rx="1" fill="#27500A"/>
        <rect x="88" y="192" width="18" height="58" rx="1" fill="#D4537E"/>
        <rect x="108" y="196" width="14" height="54" rx="1" fill="#B5D4F4"/>
        <rect x="124" y="192" width="12" height="58" rx="1" fill="#C4956A"/>
        <rect x="138" y="196" width="16" height="54" rx="1" fill="#7A9E7E"/>

        {/* WINDOW */}
        <rect x="240" y="30" width="200" height="180" rx="4" fill="#B5D4F4" opacity="0.55"/>
        <rect x="242" y="32" width="196" height="90" rx="3" fill="#D4E9FA" opacity="0.5"/>
        <ellipse cx="285" cy="65" rx="28" ry="14" fill="white" opacity="0.7"/>
        <ellipse cx="305" cy="58" rx="20" ry="12" fill="white" opacity="0.7"/>
        <ellipse cx="265" cy="62" rx="16" ry="10" fill="white" opacity="0.6"/>
        <ellipse cx="390" cy="80" rx="22" ry="11" fill="white" opacity="0.6"/>
        <ellipse cx="408" cy="74" rx="16" ry="10" fill="white" opacity="0.6"/>
        <rect x="242" y="150" width="196" height="58" rx="3" fill="#C0DD97" opacity="0.4"/>
        <rect x="240" y="30" width="200" height="180" rx="4" fill="none" stroke="#C4956A" strokeWidth="6"/>
        <line x1="340" y1="30" x2="340" y2="210" stroke="#C4956A" strokeWidth="4"/>
        <line x1="240" y1="120" x2="440" y2="120" stroke="#C4956A" strokeWidth="4"/>
        <rect x="216" y="22" width="36" height="196" rx="2" fill="#FAC775" opacity="0.38"/>
        <rect x="428" y="22" width="36" height="196" rx="2" fill="#FAC775" opacity="0.38"/>
        <ellipse cx="340" cy="308" rx="80" ry="16" fill="#FAC775" opacity="0.12"/>

        {/* RIGHT BOOKSHELF */}
        <rect x="500" y="40" width="160" height="260" rx="2" fill="#C4956A" opacity="0.4"/>
        <rect x="500" y="40" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="500" y="110" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="500" y="180" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="500" y="250" width="160" height="8" rx="1" fill="#A0724A"/>
        <rect x="500" y="294" width="160" height="6" rx="1" fill="#A0724A"/>

        {/* right books row 1 — decorative */}
        <rect x="508" y="52" width="14" height="58" rx="1" fill="#3B6D11"/>
        <rect x="524" y="56" width="12" height="54" rx="1" fill="#FAC775"/>
        <rect x="538" y="52" width="16" height="58" rx="1" fill="#D4537E"/>
        <rect x="556" y="58" width="10" height="52" rx="1" fill="#378ADD" opacity="0.5"/>
        <rect x="568" y="52" width="14" height="58" rx="1" fill="#C4956A"/>
        <rect x="584" y="56" width="18" height="54" rx="1" fill="#27500A"/>
        <rect x="604" y="52" width="12" height="58" rx="1" fill="#ED93B1"/>
        <rect x="618" y="56" width="14" height="54" rx="1" fill="#B5D4F4"/>
        <rect x="634" y="52" width="14" height="58" rx="1" fill="#7A9E7E"/>

        {/* right books row 2 — decorative */}
        <rect x="508" y="122" width="18" height="58" rx="1" fill="#B5D4F4"/>
        <rect x="528" y="126" width="12" height="54" rx="1" fill="#27500A"/>
        <rect x="542" y="122" width="14" height="58" rx="1" fill="#FAC775"/>
        <rect x="558" y="126" width="16" height="54" rx="1" fill="#D4537E"/>
        <rect x="576" y="122" width="10" height="58" rx="1" fill="#7A9E7E"/>
        <rect x="588" y="126" width="14" height="54" rx="1" fill="#378ADD"/>
        <rect x="604" y="122" width="12" height="58" rx="1" fill="#3B6D11"/>
        <rect x="618" y="126" width="18" height="54" rx="1" fill="#C4956A"/>
        <rect x="638" y="122" width="10" height="58" rx="1" fill="#ED93B1"/>

        {/* right books row 3 — decorative */}
        <rect x="508" y="192" width="14" height="58" rx="1" fill="#ED93B1"/>
        <rect x="524" y="196" width="16" height="54" rx="1" fill="#3B6D11"/>
        <rect x="542" y="192" width="10" height="58" rx="1" fill="#FAC775"/>
        <rect x="554" y="196" width="14" height="54" rx="1" fill="#378ADD"/>
        <rect x="570" y="192" width="18" height="58" rx="1" fill="#27500A"/>
        <rect x="590" y="196" width="12" height="54" rx="1" fill="#D4537E"/>
        <rect x="604" y="192" width="14" height="58" rx="1" fill="#B5D4F4"/>
        <rect x="620" y="196" width="16" height="54" rx="1" fill="#C4956A"/>
        <rect x="638" y="196" width="10" height="54" rx="1" fill="#7A9E7E"/>

        {/* TABLE */}
        <rect x="260" y="278" width="160" height="12" rx="2" fill="#A0724A"/>
        <rect x="278" y="290" width="12" height="30" rx="2" fill="#C4956A"/>
        <rect x="390" y="290" width="12" height="30" rx="2" fill="#C4956A"/>

        {/* COFFEE CUP */}
        <g onClick={handleCupClick} style={{cursor: 'pointer'}}>
          <rect x="300" y="255" width="26" height="23" rx="3" fill="#F5F0E8" stroke="#C4956A" strokeWidth="1.5"/>
          <path d="M326 262 Q336 262 336 267 Q336 272 326 272" fill="none" stroke="#C4956A" strokeWidth="1.5"/>
          <rect x="303" y="260" width="20" height="14" rx="2" fill={drinkChoice.color} opacity="0.85"/>
          <rect x="303" y="255" width="20" height="6" rx="2" fill="#C4956A" opacity="0.6"/>
          <path d="M308 252 Q310 248 308 244" stroke="#D3D1C7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M315 250 Q317 246 315 242" stroke="#D3D1C7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M322 252 Q324 248 322 244" stroke="#D3D1C7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* JOURNAL */}
        <g onClick={handleJournalClick} style={{cursor: 'pointer'}}>
          <rect x="342" y="260" width="64" height="46" rx="2" fill="#FAFAF8" stroke="#D3D1C7" strokeWidth="1"/>
          <line x1="374" y1="260" x2="374" y2="306" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="348" y1="270" x2="372" y2="270" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="348" y1="277" x2="372" y2="277" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="348" y1="284" x2="372" y2="284" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="348" y1="291" x2="372" y2="291" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="377" y1="270" x2="400" y2="270" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="377" y1="277" x2="400" y2="277" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="377" y1="284" x2="400" y2="284" stroke="#D3D1C7" strokeWidth="0.5"/>
          <line x1="377" y1="291" x2="395" y2="291" stroke="#D3D1C7" strokeWidth="0.5"/>
        </g>

        {/* PLANT */}
        <rect x="192" y="274" width="32" height="28" rx="2" fill="#C4956A" opacity="0.6"/>
        <ellipse cx="208" cy="248" rx="24" ry="28" fill="#3B6D11" opacity="0.7"/>
        <ellipse cx="194" cy="258" rx="15" ry="20" fill="#27500A" opacity="0.5"/>
        <ellipse cx="222" cy="258" rx="15" ry="20" fill="#27500A" opacity="0.5"/>

        {/* LIVE BOOKS — data driven */}
        {cafeBooks.map(book => (
          <rect
            key={book.id}
            x={book.svgX}
            y={book.svgY}
            width={book.svgWidth}
            height={book.svgHeight}
            rx="1"
            fill={book.color}
            style={{
              cursor: 'pointer',
              filter: hoveredBook === book.id
                ? 'brightness(1.3) drop-shadow(0 0 6px rgba(250, 199, 117, 0.7))'
                : 'none',
              transition: 'filter 0.2s ease',
            }}
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
            onClick={() => handleBookClick(book)}
          />
        ))}

        {/* FLOATING TITLE on hover */}
        {hoveredBookData && (
          <g pointerEvents="none">
            <rect
              x={hoveredBookData.svgX - 4}
              y={hoveredBookData.svgY - 22}
              width={hoveredBookData.title.length * 7 + 8}
              height={20}
              rx="3"
              fill="#27500A"
              opacity="0.85"
            />
            <text
              x={hoveredBookData.svgX}
              y={hoveredBookData.svgY - 7}
              fontFamily="'DM Sans', sans-serif"
              fontSize="11"
              fill="#EAF3DE"
            >
              {hoveredBookData.title}
            </text>
          </g>
        )}

      </svg>

      {/* drink picker */}
      {showDrinkPicker && (
        <div className="cafe-drink-picker">
          <p className="cafe-drink-picker__label">what are you having?</p>
          <div className="cafe-drink-picker__options">
            {drinks.map(drink => (
              <button
                key={drink.id}
                className="cafe-drink-picker__btn"
                onClick={() => handleDrinkChoice(drink)}
              >
                <span className="cafe-drink-picker__swatch" style={{background: drink.color}}/>
                {drink.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeBook && (
        <BookModal book={activeBook} onClose={handleCloseBook} />
      )}

      {showJournal && (
        <CommunityJournal onClose={() => setShowJournal(false)} />
      )}

      {activeQuestion && (
        <QuestionCard
          question={activeQuestion}
          location="cafe"
          onClose={handleCloseQuestion}
        />
      )}

    </div>
  )
}

export default CafeScreen