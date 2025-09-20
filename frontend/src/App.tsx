import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import './App.css'

// Temporary component - we'll build this properly in next steps
function DeckCreation() {
  return (
    <Layout title="Create Pitch Deck">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600 font-light">Pitch deck creation interface coming next...</p>
        </div>
      </div>
    </Layout>
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
