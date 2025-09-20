import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { SlideNavigation } from './components/deck/SlideNavigation'
import { DeckCanvas } from './components/deck/DeckCanvas'
import { ChatSidebar } from './components/chat/ChatSidebar'
import './App.css'

function DeckCreation() {
  return (
    <Layout title="Create Pitch Deck">
      <div className="h-[calc(100vh-73px)] flex flex-col">
        {/* Slide Navigation - Top */}
        <SlideNavigation />
        
        {/* Main Content Area - Bottom */}
        <div className="flex flex-1 overflow-hidden">
          {/* Deck Canvas - Left */}
          <div className="flex-1 p-6 flex">
            <DeckCanvas />
          </div>
          
          {/* Chat Sidebar - Right */}
          <ChatSidebar />
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
