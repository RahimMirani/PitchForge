import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const vcFirms = [
  {
    name: 'Andreessen Horowitz',
    short: 'a16z',
    focus: 'Consumer, AI infrastructure, fintech, bio',
  },
  {
    name: 'Y Combinator',
    short: 'YC',
    focus: 'Early-stage founders rethinking markets and tooling',
  },
  {
    name: 'Sequoia Capital',
    short: 'Sequoia',
    focus: 'Iconic companies across enterprise, consumer, and frontier tech',
  },
  {
    name: 'Lightspeed Venture Partners',
    short: 'Lightspeed',
    focus: 'Product-led growth, SaaS, marketplaces, crypto',
  },
]

const mockDecks = [
  { id: '1', title: 'FinTech Startup', summary: 'Modern treasury for SMBs.' },
  { id: '2', title: 'AI SaaS Platform', summary: 'LLM copilots for ops teams.' },
  { id: '3', title: 'E-commerce Solution', summary: 'Unified checkout for DTC brands.' },
]

export function VoicePractice() {
  const navigate = useNavigate()
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openFirmModal = (firmShort: string) => {
    setSelectedFirm(firmShort)
    setIsModalOpen(true)
  }

  const handleStartSession = (deckId?: string) => {
    setIsModalOpen(false)
    // TODO: connect selected firm + deck to voice session kickoff
  }

  const firmDetails = vcFirms.find((firm) => firm.short === selectedFirm)

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 right-[-10%] h-[440px] w-[440px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-1/4 left-[-15%] h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-12 sm:px-10">
        <header className="flex flex-col gap-6">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
            >
              <span className="text-lg">↩︎</span>
              Back to dashboard
            </button>
            <h1 className="mt-6 text-4xl font-semibold text-white">Voice practice studio</h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              Choose the investor style you want to spar with and PitchForge will adapt the questioning to match their tone, pace, and focus areas.
            </p>
          </div>
        </header>

        <main className="flex flex-col gap-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Choose your mock VC</p>
              <h2 className="text-2xl font-semibold text-white">Dial in the investor persona you want feedback from</h2>
              <p className="text-sm text-slate-300">
                Each persona sharpens different parts of your story—pick one to start the conversation.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {vcFirms.map((firm) => (
                <button
                  key={firm.short}
                  onClick={() => openFirmModal(firm.short)}
                  className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-left transition hover:border-white/30 hover:bg-slate-950/80"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.3em] text-slate-300/90">{firm.short}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm text-slate-200 transition group-hover:border-white/40 group-hover:text-white">
                      →
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">{firm.focus}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">How it works</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm font-semibold text-white">1 · Pick an investor</p>
                <p className="mt-2 text-sm text-slate-300">We tune questions to match their typical diligence angle and pressure.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm font-semibold text-white">2 · Select your deck</p>
                <p className="mt-2 text-sm text-slate-300">Pair a generated deck or freestyle to get feedback on a specific storyline.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm font-semibold text-white">3 · Practice in realtime</p>
                <p className="mt-2 text-sm text-slate-300">Voice session kicks off with live transcript, highlights, and follow-up prompts.</p>
              </div>
            </div>
          </div>
        </main>

        {isModalOpen && firmDetails && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-4 py-10 backdrop-blur">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Mock VC</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{firmDetails.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{firmDetails.focus}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {mockDecks.map((deck) => (
                  <button
                    key={deck.id}
                    onClick={() => handleStartSession(deck.id)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left transition hover:border-white/30 hover:bg-slate-900/90"
                  >
                    <p className="text-sm font-semibold text-white">{deck.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{deck.summary}</p>
                  </button>
                ))}

                <button
                  onClick={() => handleStartSession()}
                  className="w-full rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-5 text-left text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-slate-900/70"
                >
                  Practice without a deck
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}