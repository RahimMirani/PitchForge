import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { VoicePractice } from './pages/VoicePractice'
import { DeckCreation } from './pages/DeckCreation'
import './App.css'
import { AuthSession } from './lib/authSession'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <AuthSession>
              <Dashboard />
            </AuthSession>
          }
        />
        <Route
          path="/practice"
          element={
            <AuthSession>
              <VoicePractice />
            </AuthSession>
          }
        />
        <Route
          path="/create"
          element={
            <AuthSession>
              <DeckCreation />
            </AuthSession>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
