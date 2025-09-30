import { useState, useEffect } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { useNavigate } from 'react-router-dom'
import { useAction, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function DeckCreation() {
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [deckTitle, setDeckTitle] = useState('')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [deckContext, setDeckContext] = useState({
    title: '',
    startupName: '',
    overview: '',
  })
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false)
  const navigate = useNavigate()
  const createDeck = useMutation(api.decks.createDeck)
  const updateDeck = useMutation(api.decks.updateDeck)
  const generateDeck = useAction(api.ai.generateDeckFromBrief)

  // Create a new deck
  const createNewDeck = async () => {
    if (!deckTitle.trim()) {
      setDeckTitle('My Pitch Deck')
    }
    
    setIsCreatingDeck(true)
    
    try {
      const deckId = await createDeck({
        title: deckTitle.trim() || 'My Pitch Deck',
      })
      setCurrentDeckId(deckId)
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

  const handleStartDeck = () => {
    setIsOnboardingOpen(true)
  }

  const handleOnboardingSubmit = async (data: typeof deckContext) => {
    if (!currentDeckId) return

    setDeckContext(data)
    setIsGeneratingSlides(true)

    try {
      await updateDeck({
        deckId: currentDeckId,
        title: data.title,
      })
      setDeckTitle(data.title)

      await generateDeck({
        deckId: currentDeckId,
        title: data.title,
        startupName: data.startupName,
        overview: data.overview,
      })

      setIsOnboardingOpen(false)
      setActiveSlideIndex(0)
    } catch (error) {
      console.error('Failed to generate deck:', error)
      alert('Something went wrong while generating your deck. Please try again.')
    } finally {
      setIsGeneratingSlides(false)
    }
  }

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
              <DeckCanvas
                deckId={currentDeckId}
                activeSlideIndex={activeSlideIndex}
                onStartDeck={handleStartDeck}
              />
            </div>
          </div>
          <div className="w-[360px] border-l border-white/10 bg-white/80 backdrop-blur-xl">
            <ChatSidebar deckId={currentDeckId} />
          </div>
        </div>
      </div>
      {(isOnboardingOpen || isGeneratingSlides) ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          {isGeneratingSlides ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/95 px-12 py-14 text-center shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/12">
                <svg className="h-6 w-6 animate-spin text-[var(--color-violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Summoning your slides…</h3>
                <p className="mt-2 text-sm text-slate-500">The copilot is sculpting an investor-ready outline based on your brief.</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-900">Let’s get your deck started</h2>
              <p className="mt-2 text-sm text-slate-500">
                Give us a few details so the copilot can tailor your slides.
              </p>
              <form
                className="mt-6 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  handleOnboardingSubmit({
                    title: (formData.get('title') as string) ?? '',
                    startupName: (formData.get('startupName') as string) ?? '',
                    overview: (formData.get('overview') as string) ?? '',
                  })
                }}
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Deck title</label>
                  <input
                    name="title"
                    defaultValue={deckContext.title}
                    placeholder="Example: Seed Round Pitch"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-[var(--color-violet)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Startup name</label>
                  <input
                    name="startupName"
                    defaultValue={deckContext.startupName}
                    placeholder="Example: PitchForge"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-[var(--color-violet)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Startup overview</label>
                  <textarea
                    name="overview"
                    defaultValue={deckContext.overview}
                    placeholder="Give a short description of your solution, audience, and traction."
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-[var(--color-violet)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]/20"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOnboardingOpen(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                    disabled={isGeneratingSlides}
                  >
                    Not now
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--color-violet)] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(97,81,255,0.35)] transition hover:bg-[var(--color-violet)]/90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isGeneratingSlides}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : null}
    </Layout>
  )
} 