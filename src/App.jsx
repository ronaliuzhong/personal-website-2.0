import OpeningScreen from './components/OpeningScreen'
import PromptScreen from './components/PromptScreen'
import WelcomeScreen from './components/WelcomeScreen'
import LocationScreen from './components/locations/LocationScreen'
import WorldMap from './components/map/WorldMap'
import { useAppState } from './hooks/useAppState'
import { SCREENS } from './constants'
import './App.css'


function App() {
  const {
    screen,
    name,
    returning,
    currentLocation,
    handleEnter,
    handlePrompt1Submit,
    handlePrompt2Submit,
    handleEnterLocation,
    handleExitLocation,
  } = useAppState()

  if (screen === null) return null

  return (
    <div className="app">
      {screen === SCREENS.opening && (
        <OpeningScreen onEnter={handleEnter} />
      )}
      {screen === SCREENS.prompt1 && (
        <PromptScreen
          prompt="To know me, let me get to know you—what makes you happy?"
          onSubmit={handlePrompt1Submit}
        />
      )}
      {screen === SCREENS.prompt2 && (
        <PromptScreen
          prompt="I love that. What should I call you?"
          onSubmit={handlePrompt2Submit}
        />
      )}
      {screen === SCREENS.welcome && (
        <WelcomeScreen name={name} />
      )}
      {screen === SCREENS.map && (
        <WorldMap
          name={name}
          returning={returning}
          onEnterLocation={handleEnterLocation}
        />
      )}
      {screen === SCREENS.location && (
        <LocationScreen
          locationId={currentLocation}
          onExit={handleExitLocation}
        />
      )}
    </div>
  )
}

export default App