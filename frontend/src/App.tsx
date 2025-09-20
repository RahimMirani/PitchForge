import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { SlideNavigation } from './components/deck/SlideNavigation'
import { DeckCanvas } from './components/deck/DeckCanvas'
import { ChatSidebar } from './components/chat/ChatSidebar'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { VoicePractice } from './pages/VoicePractice'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<VoicePractice />} />
        <Route path="/deck/create" element={
          <Layout title="Create Pitch Deck">
            <div className="h-full flex flex-col">
              {/* Slide Navigation - Top */}
              <div className="bg-white border-b border-gray-200 shadow-sm">
                <SlideNavigation />
              </div>
              
              {/* Main Content Area - Bottom */}
              <div className="flex flex-1 min-h-0">
                {/* Deck Canvas - Left (takes most space) */}
                <div className="flex-1 p-8">
                  <DeckCanvas />
                </div>
                
                {/* Chat Sidebar - Right (fixed width) */}
                <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
                  <ChatSidebar />
                </div>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
