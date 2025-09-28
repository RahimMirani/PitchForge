import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthUI } from '../lib/AuthUI'

const featureHighlights = [
  {
    title: 'AI-crafted storytelling',
    description:
      'Feed PitchForge a quick voice note or text intake and get a VC-ready narrative in minutes.',
  },
  {
    title: 'Live research & citations',
    description:
      'Automatic market sizing, competitor analysis, and sourced insights tighten every slide.',
  },
  {
    title: 'Practice with a mock VC',
    description:
      'Rehearse your pitch in-browser with realtime voice feedback before you ever step in the room.',
  },
]

export function Landing() {
  const navigate = useNavigate()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn')

  const openAuth = (mode: 'signIn' | 'signUp') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute left-[-10%] top-1/4 h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <span className="text-xl">⚡</span>
            </div>
            PitchForge
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openAuth('signIn')}
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-medium tracking-wide text-slate-100 transition hover:border-white/40 hover:bg-white/10"
            >
              Sign in
            </button>
            <button
              onClick={() => openAuth('signUp')}
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-medium tracking-wide text-slate-100 transition hover:border-white/40 hover:bg-white/10"
            >
              Sign up
            </button>
          </div>
        </nav>

        <main className="flex flex-1 flex-col-reverse items-center gap-14 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full max-w-xl flex-col items-start text-left">
            <span className="mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              AI pitch deck studio
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Your idea, transformed into an investor-ready deck.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              PitchForge pairs realtime research, voice-enabled coaching, and polished design to help founders craft and rehearse standout pitches in record time.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openAuth('signUp')}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-wide text-slate-950 transition hover:bg-slate-100"
              >
                Sign up to get started
              </button>
              <div className="text-sm text-slate-300/80">
                Create, refine, and practice your pitch without leaving the browser.
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-lg">
            <div className="absolute -top-6 -right-4 hidden h-28 w-28 rounded-3xl border border-white/10 bg-white/5 backdrop-blur sm:block" />
            <div className="absolute -bottom-10 -left-10 hidden h-32 w-32 rounded-full border border-white/10 bg-white/5 backdrop-blur md:block" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/80">Pitch preview</span>
                  <span className="text-xs text-slate-400">Realtime</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Slide 03</p>
                    <p className="mt-2 text-base font-semibold text-white">Solution Snapshot</p>
                    <p className="mt-1 text-sm text-slate-300">
                      AI-generated visuals and bullet points align to your voice or text intake instantly.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI coach</p>
                    <p className="mt-2 text-sm text-slate-300">
                      “Let’s tighten your market sizing with fresh public data I just pulled.”
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm text-slate-200">
                    <span>Slides updated</span>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="mb-8 border-t border-white/10 pt-10">
          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white/90">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <AuthUI
        isOpen={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  )
}