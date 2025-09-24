import { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'

export function DeckCreation() {
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [deckTitle, setDeckTitle] = useState('')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
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
      <Layout backgroundVariant="aurora">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[rgba(99,102,241,0.85)] via-[rgba(63,209,201,0.7)] to-[rgba(17,24,39,0.9)] shadow-[0_20px_45px_rgba(11,18,32,0.18)]">
              <svg className="w-9 h-9 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Setting up your AI studio…</h3>
            <p className="text-slate-600">We’re initializing your workspace. This only takes a moment.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout backgroundVariant="aurora">
      <div className="h-full flex">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-8 pt-4">
              <SlideNavigation 
                deckId={currentDeckId} 
                deckTitle={deckTitle || 'Untitled Deck'}
                activeSlideIndex={activeSlideIndex}
                onSlideSelect={setActiveSlideIndex}
              />
            </div>

            <div className="flex-1 p-8 pt-6">
            <DeckCanvas 
              deckId={currentDeckId} 
              activeSlideIndex={activeSlideIndex}
            />
          </div>
        </div>
        </div>
        <div className="w-[420px] bg-white/85 backdrop-blur-xl border-l border-[var(--border-subtle)] shadow-[0_20px_45px_rgba(11,18,32,0.08)]">
          <ChatSidebar deckId={currentDeckId} />
        </div>
      </div>
    </Layout>
  )
} 