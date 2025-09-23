import { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'

export function DeckCreation() {
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [deckTitle, setDeckTitle] = useState('')

  // Create a new deck
  const createNewDeck = async () => {
    if (!deckTitle.trim()) {
      setDeckTitle('My Pitch Deck')
    }
    
    setIsCreatingDeck(true)
    
    try {
      const response = await fetch('https://fastidious-mosquito-435.convex.cloud/api/mutation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'decks:createDeck',
          args: {
            title: deckTitle.trim() || 'My Pitch Deck'
          },
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create deck: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const result = await response.json()
      setCurrentDeckId(result.value || result)
    } catch (error) {
      console.error('Failed to create deck:', error)
      alert('Failed to create deck. Please try again.')
    } finally {
      setIsCreatingDeck(false)
    }
  }

  // Auto-create a deck when component loads
  useEffect(() => {
    if (!currentDeckId) {
      setDeckTitle('My Startup Pitch')
      createNewDeck()
    }
  }, [])

  // Show loading screen while creating deck
  if (!currentDeckId) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Pitch Deck</h3>
            <p className="text-gray-600">Setting up your workspace...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="h-full flex">
        {/* Main Content Area - Left */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Slide Navigation - Top */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <SlideNavigation deckId={currentDeckId} />
          </div>
          
          {/* Deck Canvas - Bottom */}
          <div className="flex-1 p-8">
            <DeckCanvas />
          </div>
        </div>
        
        {/* Chat Sidebar - Right (Full Height) */}
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
          <ChatSidebar deckId={currentDeckId} />
        </div>
      </div>
    </Layout>
  )
} 