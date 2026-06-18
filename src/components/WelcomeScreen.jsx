import { useState, useEffect } from 'react'
import './WelcomeScreen.css'

function WelcomeScreen({ name }) {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadingOut(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`welcome-screen ${fadingOut ? 'fade-out' : ''}`}>
      <p className="welcome-text">Welcome, {name}.</p>
    </div>
  )
}

export default WelcomeScreen