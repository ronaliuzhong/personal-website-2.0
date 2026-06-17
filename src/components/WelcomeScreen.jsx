import './WelcomeScreen.css'

function WelcomeScreen({ name }) {
  return (
    <div className="welcome-screen">
      <p className="welcome-text">Welcome, {name}.</p>
    </div>
  )
}

export default WelcomeScreen