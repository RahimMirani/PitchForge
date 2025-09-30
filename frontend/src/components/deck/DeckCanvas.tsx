import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface DeckCanvasProps {
  deckId?: string | null;
  activeSlideIndex?: number;
  onStartDeck?: () => void;
}

interface Slide {
  _id: string;
  title: string;
  content: string;
  order: number;
}

export function DeckCanvas({ deckId, activeSlideIndex = 0, onStartDeck }: DeckCanvasProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const slides = useQuery(api.slides.getSlidesByDeck, deckId ? { deckId } : undefined);
  const updateSlide = useMutation(api.slides.updateSlide);
  const deleteSlideMutation = useMutation(api.slides.deleteSlide);
  const slideList = slides ?? [];
  const isLoading = Boolean(deckId) && slides === undefined;
  const currentSlide = slideList[activeSlideIndex];

  const startEditing = () => {
    if (currentSlide) {
      setEditTitle(currentSlide.title);
      setEditContent(currentSlide.content);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const saveSlide = async () => {
    if (!currentSlide) return;

    setIsSaving(true);
    try {
      const updates: { title?: string; content?: string } = {};
      if (editTitle !== currentSlide.title) {
        updates.title = editTitle;
      }
      if (editContent !== currentSlide.content) {
        updates.content = editContent;
      }

      if (Object.keys(updates).length > 0) {
        await updateSlide({
          slideId: currentSlide._id,
          ...updates,
        });
      }

      setIsEditing(false);
      setEditTitle('');
      setEditContent('');
    } catch (error) {
      console.error('Failed to save slide:', error);
      alert('Failed to save slide. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSlide = async () => {
    if (!currentSlide) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${currentSlide.title}"?`);
    if (!confirmDelete) return;

    try {
      await deleteSlideMutation({
        slideId: currentSlide._id,
      });
    } catch (error) {
      console.error('Failed to delete slide:', error);
      alert('Failed to delete slide. Please try again.');
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-white/88 shadow-[0_30px_80px_rgba(8,15,31,0.35)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/15 px-5 py-3 backdrop-blur">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            {slideList.length > 0 ? `Slide ${activeSlideIndex + 1}` : 'No slides yet'}
          </span>
          <h3 className="mt-1 text-[26px] font-semibold leading-tight text-slate-900">
            {currentSlide ? currentSlide.title : 'Select or compose a slide'}
          </h3>
          {slideList.length === 0 && (
            <p className="text-sm text-slate-500">Start crafting your story with AI support.</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {currentSlide ? (
            <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${isEditing ? 'bg-[rgba(97,81,255,0.14)] text-[var(--color-violet)]' : 'bg-[rgba(63,209,201,0.14)] text-[var(--color-aqua)]'}`}>
              {isEditing ? 'Editing' : 'Viewing'}
            </span>
          ) : null}
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSlide}
                  disabled={isSaving}
                  className="rounded-full bg-[var(--color-violet)] px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--color-violet)]/90 disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save slide'}
                </button>
              </>
            ) : currentSlide ? (
              <>
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16.862 4.487l1.651 1.651a2 2 0 010 2.828l-8.21 8.21-3.715.413a1 1 0 01-1.106-1.106l.413-3.715 8.21-8.21a2 2 0 012.828 0z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={deleteSlide}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[rgba(255,111,97,0.18)] px-4 py-1.5 text-xs font-semibold text-[var(--color-coral)] transition hover:bg-[rgba(255,111,97,0.28)]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="relative h-full overflow-y-auto px-5 py-5">
          <div className="w-full">
            {isLoading ? (
              <div className="space-y-6">
                <div className="h-7 w-48 rounded-full bg-white/70" />
                <div className="h-[360px] rounded-3xl border border-white/30 bg-white/80 shadow-[0_26px_70px_rgba(8,15,31,0.25)]" />
              </div>
            ) : currentSlide ? (
              <div className="relative">
                <div className="absolute -inset-4 rounded-[30px] bg-gradient-to-br from-white/50 to-transparent blur-2xl" />
                <div className="relative rounded-[24px] border border-white/35 bg-white/95 px-6 py-6 shadow-[0_26px_70px_rgba(8,15,31,0.24)]">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Slide title</label>
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 focus-within:border-[var(--color-violet)] focus-within:ring-2 focus-within:ring-[var(--color-violet)]/30">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-transparent text-[24px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            placeholder="Problem & Opportunity"
                          />
                          <span className="text-[11px] text-slate-400">{editTitle.length}/120</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Narrative</label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mt-2 h-[300px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base leading-relaxed text-slate-700 focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)]/25"
                          placeholder="Detail the insight, your solution, key metrics, and next steps."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-[32px] font-bold tracking-tight text-slate-900">
                          {currentSlide.title}
                        </h1>
                        <span className="inline-flex items-center rounded-full border border-[var(--color-violet)]/40 bg-[var(--color-violet)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-violet)]">
                          Investor ready
                        </span>
                      </div>
                      <div className="space-y-4 text-[16px] leading-relaxed text-slate-700">
                        {currentSlide.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="relative pl-6">
                            <span className="absolute left-0 top-2 inline-block h-2 w-2 rounded-full bg-[var(--color-violet)]" />
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex w-full max-w-xl flex-col items-center rounded-3xl border border-dashed border-white/40 bg-white/82 px-10 py-12 text-center text-slate-500 shadow-[0_24px_60px_rgba(8,15,31,0.18)]">
                  <h3 className="mt-5 text-[28px] font-semibold text-slate-900">Ready to craft your pitch deck?</h3>
                  <p className="mt-3 max-w-md text-sm text-slate-500">
                    Share a quick brief with the copilot and we’ll conjure your opening flow—tailored to your startup’s story.
                  </p>
                  <button
                    onClick={onStartDeck}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-violet)] px-8 py-3 text-base font-semibold text-white shadow-[0_26px_60px_rgba(97,81,255,0.38)] transition hover:bg-[var(--color-violet)]/90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6v12m6-6H6" />
                    </svg>
                    Get started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 