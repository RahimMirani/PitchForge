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
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Choose your mock VC</p>
              <h2 className="text-2xl font-semibold text-white">Investor personas coming soon</h2>
              <p className="text-sm text-slate-300">
                We&rsquo;re building tailored mock VC profiles so you can spar with different questioning styles. Until then, you can run a freestyle practice session.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-slate-950/50 p-10 text-center">
              <span className="text-4xl">🎧</span>
              <h3 className="text-lg font-semibold text-white">No personas available yet</h3>
              <p className="max-w-sm text-sm text-slate-300">
                Start a practice run without a specific investor, or check back soon for curated VC presets.
              </p>
              <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Start freestyle session
              </button>
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

        {/* Investor personas will return once presets are defined */}
      </div>
    </div>
  )
}