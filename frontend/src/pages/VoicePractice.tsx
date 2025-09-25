import { useNavigate } from 'react-router-dom'

const rehearsalPrompts = [
  'Walk me through your business model as if I am a skeptical VC.',
  'Explain how you outpace competitors in one concise paragraph.',
  'State your traction highlights with concrete metrics.',
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
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
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
              Rehearse with an AI mock VC, receive instant coaching on delivery, and keep track of every session without leaving the browser.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur md:w-64">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Session status</p>
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" /> Ready when you are
            </div>
            <p className="text-xs text-slate-300">You will connect to Vapi for realtime coaching. Microphone access required.</p>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[0.6fr,0.4fr]">
          <section className="flex flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <span className="text-2xl">🎤</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">AI coach</p>
                  <h2 className="text-xl font-semibold text-white">Warm up your delivery</h2>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm text-slate-200">
                  “Let&rsquo;s rehearse your opener. When you start, I&rsquo;ll listen for clarity, pacing, and confidence. Pause anytime to see highlights.”
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Start voice practice
                </button>
                <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10">
                  Review last session
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live transcript</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-4">
                  <span className="text-slate-400/80">Coach • </span>
                  Start with the market problem statement. Press space if you need a break.
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-4 text-slate-200">
                  You: Launching soon…
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-4">
                  <span className="text-slate-400/80">Coach • </span>
                  Great energy—tighten the TAM numbers next pass.
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Rehearsal prompts</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {rehearsalPrompts.map((prompt) => (
                  <li key={prompt} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Session notes</p>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-slate-200">Highlight: Strong story arc</p>
                  <p className="text-xs text-slate-400">Keep your momentum by transitioning into the traction slide earlier.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-slate-200">Next drill</p>
                  <p className="text-xs text-slate-400">Practice responding to “What stops incumbents from copying you?”</p>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}