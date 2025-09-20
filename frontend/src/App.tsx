import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { SlideNavigation } from './components/deck/SlideNavigation'
import { DeckCanvas } from './components/deck/DeckCanvas'
import { ChatSidebar } from './components/chat/ChatSidebar'
import './App.css'

function DeckCreation() {
  return (
    <Layout title="Create Pitch Deck">
      <div className="h-[calc(100vh-65px)] flex flex-col bg-gray-50">
        {/* Slide Navigation - Top */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <SlideNavigation />
        </div>
        
        {/* Main Content Area - Bottom */}
        <div className="flex flex-1 min-h-0">
          {/* Deck Canvas - Left (takes most space) */}
          <div className="flex-1 p-8 bg-gray-50">
            <DeckCanvas />
          </div>
          
          {/* Chat Sidebar - Right (fixed width) */}
          <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
            <ChatSidebar />
          </div>
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
