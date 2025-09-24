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

  const workspaceHeader = (
    <div className="border-b border-[var(--border-subtle)]/70 backdrop-blur-xl bg-white/70 shadow-[0_12px_34px_rgba(11,18,32,0.05)]">
      <div className="px-10 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace</span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[rgba(63,209,201,0.14)] text-[var(--color-aqua)]">
              Live Sync
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1 tracking-tight">Untitled Deck</h1>
          <p className="text-sm text-slate-500 mt-1">Craft each slide with AI co-creation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-white text-slate-600 hover:text-slate-900 hover:border-[var(--border-strong)]">
            Export Deck
          </button>
          <button className="px-5 py-2 rounded-full bg-[var(--color-violet)] text-white shadow-[0_12px_30px_rgba(97,81,255,0.35)] hover:shadow-[0_16px_40px_rgba(97,81,255,0.45)]">
            Save Progress
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <Layout backgroundVariant="aurora">
      <div className="h-full flex">
        <div className="flex flex-col flex-1 min-h-0">
          {workspaceHeader}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Slide Navigation - Top */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
              <SlideNavigation 
                deckId={currentDeckId} 
                activeSlideIndex={activeSlideIndex}
                onSlideSelect={setActiveSlideIndex}
              />
            </div>
            {/* Deck Canvas - Bottom */}
            <div className="flex-1 p-8">
              <DeckCanvas 
                deckId={currentDeckId} 
                activeSlideIndex={activeSlideIndex}
              />
            </div>
          </div>
        </div>
        {/* Main Content Area - Left */}
        {/* Chat Sidebar - Right (Full Height) */}
        <div className="w-[420px] bg-white/85 backdrop-blur-xl border-l border-[var(--border-subtle)] shadow-[0_20px_45px_rgba(11,18,32,0.08)]">
          <ChatSidebar deckId={currentDeckId} />
        </div>
      </div>
    </Layout>
  )
} 