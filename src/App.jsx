import OpeningScreen from './components/OpeningScreen'
import './App.css'

function App() {
  return (
    <div className="app">
      <OpeningScreen onEnter={() => console.log('clicked!')} />
    </div>
  )
}

export default App