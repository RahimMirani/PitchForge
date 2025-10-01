import { useState, useEffect, useRef, useCallback } from 'react'
import { Layout } from '../components/layout/Layout'
import { SlideNavigation } from '../components/deck/SlideNavigation'
import { DeckCanvas } from '../components/deck/DeckCanvas'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '../convexClient'

export function DeckCreation() {
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [deckTitle, setDeckTitle] = useState('')
  const [isTitleDirty, setIsTitleDirty] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [deckContext, setDeckContext] = useState({
    title: '',
    startupName: '',
    overview: '',
  })
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false)
  const [isSavingDeck, setIsSavingDeck] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const createDeck = useMutation(api.decks.createDeck)
  const updateDeck = useMutation(api.decks.updateDeck)
  const generateDeck = useAction(api.ai.generateDeckFromBrief)
  const initRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const syncTitleFromServer = useCallback((title: string) => {
    setDeckTitle(title)
    setIsTitleDirty(false)
    setActiveSlideIndex(0)
  }, [])

  const createNewDeck = async (proposedTitle?: string) => {
    if (isCreatingDeck) return null
    const finalTitle = (proposedTitle && proposedTitle.trim()) || 'My Pitch Deck'
    setDeckTitle(finalTitle)
    setIsTitleDirty(false)
    setIsCreatingDeck(true)

    try {
      const deckId = await createDeck({
        title: finalTitle,
      })
      setCurrentDeckId(deckId)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('activeDeckId', deckId)
      }
      return deckId
    } catch (error) {
      console.error('Failed to create deck:', error)
      setToast({ message: 'Failed to create deck. Please try again.', tone: 'error' })
      return null
    } finally {
      setIsCreatingDeck(false)
    }
  }

  useEffect(() => {
    if (initRef.current || typeof window === 'undefined') return
    initRef.current = true

    void (async () => {
      const navState = (location.state as { newDeck?: boolean; deckId?: string } | null) ?? null
      const requestedDeckId = navState?.deckId
      const newDeckRequested = Boolean(navState?.newDeck)

      if (requestedDeckId) {
        sessionStorage.setItem('activeDeckId', requestedDeckId)
        setCurrentDeckId(requestedDeckId)
        setDeckTitle('')
        setIsTitleDirty(false)
        setDeckContext({ title: '', startupName: '', overview: '' })
        setActiveSlideIndex(0)
        navigate('/create', { replace: true, state: null })
        setIsReady(true)
        return
      }

      if (newDeckRequested) {
        sessionStorage.removeItem('activeDeckId')
        setCurrentDeckId(null)
        setDeckTitle('')
        setIsTitleDirty(false)
        setDeckContext({ title: '', startupName: '', overview: '' })
        setActiveSlideIndex(0)
        await createNewDeck('My Startup Pitch')
        navigate('/create', { replace: true, state: null })
        setIsReady(true)
        return
      }

      const storedId = sessionStorage.getItem('activeDeckId')
      if (storedId) {
        setCurrentDeckId(storedId)
        setDeckTitle('')
        setIsTitleDirty(false)
        setIsReady(true)
      } else {
        await createNewDeck('My Startup Pitch')
        setIsReady(true)
      }
    })()
  }, [location.state, navigate])

  useEffect(() => {
    if (!isReady) return
    if (typeof window === 'undefined') return
    if (currentDeckId) {
      sessionStorage.setItem('activeDeckId', currentDeckId)
    }
  }, [currentDeckId, isReady])

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
      setIsTitleDirty(false)

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
      setToast({ message: 'Something went wrong while generating your deck. Please try again.', tone: 'error' })
    } finally {
      setIsGeneratingSlides(false)
    }
  }

  const handleSaveDeck = async () => {
    if (!currentDeckId) return

    const trimmedTitle = deckTitle.trim()
    if (!trimmedTitle) {
      setToast({ message: 'Please give your deck a title before saving.', tone: 'error' })
      return
    }

    setIsSavingDeck(true)
    try {
      await updateDeck({
        deckId: currentDeckId,
        title: trimmedTitle,
      })
      setDeckTitle(trimmedTitle)
      setIsTitleDirty(false)
      setToast({ message: 'Deck saved.', tone: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('nonexistent document')) {
        try {
          const newDeckId = await createDeck({ title: trimmedTitle })
          setCurrentDeckId(newDeckId)
          setDeckTitle(trimmedTitle)
          setIsTitleDirty(false)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('activeDeckId', newDeckId)
          }
          setToast({ message: 'Deck was recreated and saved.', tone: 'success' })
        } catch (createError) {
          console.error('Failed to recreate deck after missing record:', createError)
          setToast({ message: 'Unable to save because the deck record was missing. Please try again.', tone: 'error' })
        }
      } else {
        console.error('Failed to save deck:', error)
        setToast({ message: 'Saving failed. Please try again.', tone: 'error' })
      }
    } finally {
      setIsSavingDeck(false)
    }
  }

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  return (
    <Layout backgroundVariant="aurora">
      <div className="relative h-full overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute bottom-[-25%] right-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-1/3 left-[-15%] h-[380px] w-[380px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="relative flex h-full overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 px-8 py-6 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/25 hover:bg-white/10"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10">
                  Export
                </button>
                <button
                  onClick={handleSaveDeck}
                  disabled={isSavingDeck}
                  className="rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingDeck ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            <SlideNavigation
              deckId={currentDeckId}
              deckTitle={deckTitle || 'Untitled Deck'}
              activeSlideIndex={activeSlideIndex}
              onSlideSelect={setActiveSlideIndex}
              onRenameDeck={(title) => {
                setDeckTitle(title)
                setIsTitleDirty(true)
              }}
            />

            <div className="flex flex-1 gap-5 overflow-hidden">
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

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div
            className={`rounded-full px-5 py-2 text-sm font-medium shadow-xl backdrop-blur ${
              toast.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-500/90 text-white'
                : 'border border-rose-200 bg-rose-500/90 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
      <DeckMetadataSync
        deckId={isReady ? currentDeckId : null}
        isTitleDirty={isTitleDirty}
        onSyncTitle={syncTitleFromServer}
      />
    </Layout>
  )
}

type DeckMetadataSyncProps = {
  deckId: string | null
  isTitleDirty: boolean
  onSyncTitle: (title: string) => void
}

function DeckMetadataSync({ deckId, isTitleDirty, onSyncTitle }: DeckMetadataSyncProps) {
  if (!deckId) {
    return null
  }

  const deck = useQuery(api.decks.getDeckWithSlidesByStringId, { deckId })

  useEffect(() => {
    if (!isTitleDirty && deck?.title) {
      onSyncTitle(deck.title)
    }
  }, [deck?.title, isTitleDirty, onSyncTitle])

  return null
} 