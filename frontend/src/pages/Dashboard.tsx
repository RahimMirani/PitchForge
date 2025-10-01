import { useNavigate } from 'react-router-dom'
import { signOutUser } from '../lib/auth-client'
import { useQuery } from 'convex/react'
import { api } from '../../../backend/convex/_generated/api'
import { type Id } from '../../../backend/convex/_generated/dataModel'

interface Conversation {
  _id: Id<'Voiceconversations'>
  _creationTime: number
  firmTag: string
}

interface DeckSummary {
  _id: Id<'decks'>
  title: string
  createdAt?: number
  updatedAt?: number
}

export function Dashboard() {
  const navigate = useNavigate()
  const recentConversations = useQuery(api.voiceai.getRecentConversations)
  const decks = useQuery(api.decks.getDecks) as DeckSummary[] | undefined
  const currentUser = useQuery(api.auth.getCurrentUser)

  const handleSignOut = async () => {
    await signOutUser()
    navigate('/')
  }

  const handleCreateDeck = () => navigate('/create', { state: { newDeck: true } })

  const userName = currentUser?.name ?? 'Founder'

  const renderDeckList = () => {
    if (decks === undefined) {
      return (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`deck-skeleton-${index}`}
              className="h-16 animate-pulse rounded-2xl border border-white/10 bg-white/10"
            />
          ))}
        </div>
      )
    }

    if (decks.length === 0) {
      return (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-10 text-center">
          <span className="text-4xl">🗂️</span>
          <h3 className="text-lg font-semibold text-white">No decks yet</h3>
          <p className="max-w-sm text-sm text-slate-300">
            When you generate a new pitch deck, it will appear here with realtime previews and status updates.
          </p>
          <button
            onClick={handleCreateDeck}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Create your first deck
          </button>
        </div>
      )
    }

    return (
      <div className="mt-6 space-y-3">
        {decks.map((deck) => (
          <div
            key={deck._id}
            className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
          >
            <div>
              <p className="text-base font-semibold text-white/90">{deck.title || 'Untitled Deck'}</p>
              <p className="text-xs text-slate-300">
                Created {formatTimestamp(deck.createdAt ?? deck.updatedAt ?? 0)} · Updated {formatTimestamp(deck.updatedAt ?? deck.createdAt ?? 0)}
              </p>
            </div>
            <button
              onClick={() => navigate('/create', { state: { deckId: deck._id } })}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/35 hover:bg-white/10"
            >
              Open deck
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 overflow-clip">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[540px] w-[540px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-[-15%] h-[340px] w-[340px] rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 sm:px-10">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Welcome back</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">{userName}'s pitch HQ</h1>
              <p className="mt-3 max-w-xl text-base text-slate-300">
                Build, rehearse, and ship investor-ready decks in one place. Pick up where you left off or spin up something new.
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="ml-auto flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-slate-200 transition hover:border-white/30 hover:bg-white/10"
            >
              <span className="text-lg">↩︎</span>
              Sign out
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleCreateDeck}
              className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-wide text-slate-950 transition hover:bg-slate-100"
            >
              <span className="text-lg">➕</span>
              Start a new pitch deck
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-slate-100 transition hover:border-white/40 hover:bg-white/10"
            >
              <span className="text-lg">🎙️</span>
              Practice with voice
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">Recent decks</h2>
              {decks && decks.length > 0 && (
                <button className="text-sm text-slate-300 transition hover:text-white" onClick={handleCreateDeck}>
                  Start new
                </button>
              )}
            </div>
            {renderDeckList()}
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">Recent voice sessions</h2>
              {recentConversations && recentConversations.length > 0 && (
                <button
                  onClick={() => navigate('/practice')}
                  className="text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  Start new session
                </button>
              )}
            </div>
            <div className="mt-6 flex flex-1 flex-col">
              {recentConversations === undefined ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">Loading sessions...</div>
              ) : recentConversations.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-10 text-center">
                  <span className="text-4xl">🎙️</span>
                  <h3 className="text-lg font-semibold text-white">No voice practice yet</h3>
                  <p className="max-w-xs text-sm text-slate-300">
                    Run your first mock VC session to see recordings, feedback, and highlights here.
                  </p>
                  <button
                    onClick={() => navigate('/practice')}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
                  >
                    Start a practice session
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentConversations.map((convo: Conversation) => (
                    <div
                      key={convo._id}
                      className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
                    >
                      <div>
                        <p className="font-medium text-white/90">{convo.firmTag}</p>
                        <p className="text-xs text-slate-300">
                          {new Date(convo._creationTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/35 hover:bg-white/10">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function formatTimestamp(timestamp: number) {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
} 