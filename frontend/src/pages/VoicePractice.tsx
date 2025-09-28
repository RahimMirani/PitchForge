import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useQuery } from 'convex/react'
import { api } from '../../../backend/convex/_generated/api'
import { VapiSession } from '../components/voice/VapiSession'

export function VoicePractice() {
  const navigate = useNavigate()
  const [selectedFirmTag, setSelectedFirmTag] = useState<string | null>(null)
  const [selectedDeckOption, setSelectedDeckOption] = useState<string | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const decks = useQuery(api.decks.getDecks)

  const isButtonDisabled = !selectedFirmTag || !selectedDeckOption

  const handleStartSession = () => {
    if (!isButtonDisabled) {
      setIsSessionActive(true)
    }
  }

  return (
    <>
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
                    <div
                      key={firm.tag}
                      className={cn(
                        'cursor-pointer rounded-xl border border-white/10 bg-slate-900/70 p-4 transition',
                        selectedFirmTag === firm.tag && 'ring-2 ring-blue-500',
                      )}
                      onClick={() => setSelectedFirmTag(firm.tag)}
                    >
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
                  <div
                    className={cn(
                      'group rounded-xl border border-white/10 bg-slate-900/70 p-4 transition',
                      selectedDeckOption && selectedDeckOption !== 'freestyle' && 'ring-2 ring-blue-500',
                    )}
                  >
                    <select
                      value={selectedDeckOption !== 'freestyle' ? selectedDeckOption ?? '' : ''}
                      onChange={(e) => setSelectedDeckOption(e.target.value)}
                      className="w-full cursor-pointer bg-transparent font-semibold text-white outline-none"
                    >
                      <option value="" disabled>
                        {decks === undefined ? 'Loading decks...' : 'Select a pitch deck'}
                      </option>
                      {decks?.map((deck) => (
                        <option key={deck._id} value={deck._id} className="bg-slate-800 text-white">
                          {deck.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h4 className="text-center font-semibold text-white">OR</h4>
                  </div>

                  <div
                    className={cn(
                      'cursor-pointer rounded-xl border border-white/10 bg-slate-900/70 p-4 transition',
                      selectedDeckOption === 'freestyle' && 'ring-2 ring-blue-500',
                    )}
                    onClick={() => setSelectedDeckOption('freestyle')}
                  >
                    <h4 className="font-semibold text-white">Practice without a deck</h4>
                    <p className="mt-2 text-sm text-slate-300">Spar with the AI in freestyle mode.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={isButtonDisabled}
                onClick={handleStartSession}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Start Practice
              </button>
            </div>
          </main>

          {/* Investor personas will return once presets are defined */}
        </div>
      </div>
      {isSessionActive && selectedFirmTag && selectedDeckOption && (
        <VapiSession
          onSessionEnd={() => setIsSessionActive(false)}
          selectedFirmTag={selectedFirmTag}
          selectedDeckOption={selectedDeckOption}
        />
      )}
    </>
  )
}