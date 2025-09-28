import { useNavigate } from 'react-router-dom'

const mockDecks = [
  { id: '1', title: 'FinTech Startup', summary: 'Modern treasury for SMBs.' },
  { id: '2', title: 'AI SaaS Platform', summary: 'LLM copilots for ops teams.' },
  { id: '3', title: 'E-commerce Solution', summary: 'Unified checkout for DTC brands.' },
]

export function VoicePractice() {
  const navigate = useNavigate()

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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Choose your mock VC</p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    tag: 'a16z',
                    name: 'Andreessen Horowitz',
                    focus: 'Breakout AI, consumer, and fintech founders.',
                  },
                  {
                    tag: 'YC',
                    name: 'Y Combinator',
                    focus: 'Early-stage teams with fast iteration and sharp stories.',
                  },
                  {
                    tag: 'Sequoia',
                    name: 'Sequoia Capital',
                    focus: 'Global scale businesses with durable moats.',
                  },
                  {
                    tag: 'Lightspeed',
                    name: 'Lightspeed Venture Partners',
                    focus: 'Product-led growth, SaaS, marketplaces, and crypto.',
                  },
                ].map((firm) => (
                  <div key={firm.tag} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{firm.tag}</p>
                    <h4 className="text-lg font-semibold text-white">{firm.name}</h4>
                    <p className="text-sm text-slate-300">{firm.focus}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Select your deck</p>
              </div>
              <div className="mt-10 flex flex-col gap-4">
                <div className="cursor-pointer rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <h4 className="font-semibold text-white">Practice without a deck</h4>
                  <p className="mt-2 text-sm text-slate-300">Spar with the AI in freestyle mode.</p>
                </div>
                {mockDecks.map((deck) => (
                  <div key={deck.id} className="cursor-pointer rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <h4 className="font-semibold text-white">{deck.title}</h4>
                    <p className="mt-2 text-sm text-slate-300">{deck.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <button className="w-full rounded-lg bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
              Start Practice
            </button>
          </div>
        </main>

        {/* Investor personas will return once presets are defined */}
      </div>
    </div>
  )
}