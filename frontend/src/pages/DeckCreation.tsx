import { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { useNavigate } from 'react-router-dom'

export function DeckCreation() {
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [deckTitle, setDeckTitle] = useState('')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const navigate = useNavigate()
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
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/25 blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute top-1/4 left-[-15%] h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-3xl" />
          </div>
          <div className="relative text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/15 bg-white/10 backdrop-blur">
              <svg className="h-12 w-12 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold text-white">Setting up your AI studio…</h3>
            <p className="mt-3 text-sm text-slate-300">We’re preparing your workspace. Hang tight for just a moment.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout backgroundVariant="aurora">
      <div className="relative h-full overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute bottom-[-25%] right-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-1/3 left-[-15%] h-[380px] w-[380px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="relative flex h-full">
          <div className="flex min-h-0 flex-1 flex-col gap-5 px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/25 hover:bg-white/10"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10">
                  Export
                </button>
                <button className="rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-950 transition hover:bg-slate-100">
                  Save
                </button>
              </div>
            </div>

            <SlideNavigation
              deckId={currentDeckId}
              deckTitle={deckTitle || 'Untitled Deck'}
              activeSlideIndex={activeSlideIndex}
              onSlideSelect={setActiveSlideIndex}
            />

            <div className="flex flex-1 gap-5">
              <DeckCanvas deckId={currentDeckId} activeSlideIndex={activeSlideIndex} />
            </div>
          </div>
          <div className="w-[360px] border-l border-white/10 bg-white/80 backdrop-blur-xl">
            <ChatSidebar deckId={currentDeckId} />
          </div>
        </div>
      </div>
    </Layout>
  )
} 