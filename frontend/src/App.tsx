import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { VoicePractice } from './pages/VoicePractice'
import { DeckCreation } from './pages/DeckCreation'
import './App.css'
import { AuthRoute } from './lib/authroute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes that anyone can access */}
        <Route path="/" element={<Landing />} />

        {/* Protected routes that require authentication */}
        <Route
          element={
            <AuthRoute>
              <Outlet />
            </AuthRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<VoicePractice />} />
          <Route path="/create" element={<DeckCreation />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
