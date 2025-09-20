import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Temporary component - we'll build this properly in next steps
function DeckCreation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-light text-gray-900 mb-8">Create Pitch Deck</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600 font-light">Pitch deck creation interface coming next...</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/deck/create" replace />} />
        <Route path="/deck/create" element={<DeckCreation />} />
      </Routes>
    </Router>
  )
}

export default App
