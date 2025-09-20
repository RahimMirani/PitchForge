import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { VoicePractice } from './pages/VoicePractice'
import { DeckCreation } from './pages/DeckCreation'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<VoicePractice />} />
        <Route path="/deck/create" element={<DeckCreation />} />
      </Routes>
    </Router>
  )
}

export default App
