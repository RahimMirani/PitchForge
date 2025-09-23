import { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'

export function DeckCreation() {
  // For now, we'll use a fixed test deck ID
  // Later this will come from route params or deck creation
  const [currentDeckId] = useState<string>("j57abc123def456") // Replace with your test deck ID

  return (
    <Layout>
      <div className="h-full flex">
        {/* Main Content Area - Left */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Slide Navigation - Top */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <SlideNavigation />
          </div>
          
          {/* Deck Canvas - Bottom */}
          <div className="flex-1 p-8">
            <DeckCanvas />
          </div>
        </div>
        
        {/* Chat Sidebar - Right (Full Height) */}
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
          <ChatSidebar deckId={currentDeckId as any} />
        </div>
      </div>
    </Layout>
  )
} 