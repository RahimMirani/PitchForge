import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface SlideNavigationProps {
  deckId?: string | null;
  deckTitle: string;
  activeSlideIndex?: number;
  onSlideSelect?: (index: number) => void;
}

interface Slide {
  _id: string;
  title: string;
  content: string;
  order: number;
  createdAt?: number;
}

export function SlideNavigation({ deckId, deckTitle, activeSlideIndex = 0, onSlideSelect }: SlideNavigationProps) {
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const slides = useQuery(api.slides.getSlidesByDeck, deckId ? { deckId } : undefined);
  const createSlide = useMutation(api.slides.createSlide);
  const isLoading = Boolean(deckId) && slides === undefined;
  const slideList = slides ?? [];

  useEffect(() => {
    if (!deckId) {
      setLastSyncedAt(null);
      return;
    }

    if (slideList.length > 0 || slides?.length === 0) {
      setLastSyncedAt(new Date());
    }
  }, [deckId, slideList, slides]);

  const createNewSlide = async () => {
    if (!deckId || isCreatingSlide) {
      return;
    }
    setIsCreatingSlide(true);
    try {
      await createSlide({
        deckId,
        title: `New Slide ${slideList.length + 1}`,
        content: 'Click edit to add content to this slide.',
      });
      setLastSyncedAt(new Date());
      const newSlideIndex = slideList.length;
      onSlideSelect?.(newSlideIndex);
    } catch (error) {
      console.error('Failed to create slide:', error);
      alert('Failed to create slide. Please try again.');
    } finally {
      setIsCreatingSlide(false);
    }
  };

  const tileBase = 'h-[104px] w-[168px]'

  const renderSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className={`${tileBase} animate-pulse rounded-2xl border border-white/15 bg-white/35 backdrop-blur`}
      />
    ))

  const formattedSyncedAt = lastSyncedAt
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(lastSyncedAt)
    : 'syncing…'

  const slideTiles = isLoading
    ? renderSkeletons()
    : slideList.length > 0
      ? slideList.map((slide, index) => {
          const isActive = index === activeSlideIndex

          return (
            <button
              key={slide._id}
              onClick={() => onSlideSelect?.(index)}
              className={`group relative ${tileBase} shrink-0 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-200 backdrop-blur ${
                isActive
                  ? 'border-white/45 bg-white/90 shadow-[0_16px_40px_rgba(8,15,31,0.24)]'
                  : 'border-white/15 bg-white/65 hover:border-white/35 hover:bg-white/80 hover:shadow-[0_14px_34px_rgba(8,15,31,0.18)]'
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 via-white/10 to-transparent opacity-60" />
              <div className="relative flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.36em] text-slate-500">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white text-[var(--color-violet)]">
                  {index + 1}
                </span>
              </div>
              <div className="relative mt-3 space-y-2">
                <p className={`text-sm font-semibold leading-snug ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {slide.title}
                </p>
                <p className="text-[11px] text-slate-500/80 line-clamp-2">
                  {slide.content ? slide.content.slice(0, 70) + (slide.content.length > 70 ? '…' : '') : 'Tap to craft details'}
                </p>
              </div>
              {isActive ? (
                <span className="absolute inset-x-5 bottom-2 h-0.5 rounded-full bg-gradient-to-r from-[var(--color-violet)] via-[var(--color-aqua)] to-[var(--color-violet)]" />
              ) : null}
            </button>
          )
        })
      : (
        <div className={`${tileBase} flex shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-white/30 bg-white/55 text-center text-[12px] text-slate-500 backdrop-blur`}
        >
          <span className="mb-1 text-[var(--color-violet)] font-semibold">No slides yet</span>
          Ask the copilot to draft your opener.
        </div>
      )

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white/6 px-4 py-3 backdrop-blur">
      <div className="flex h-full items-start gap-5">
        <div className="flex-shrink-0 pr-4">
          <h1 className="text-lg font-semibold text-white">
            {deckTitle}
          </h1>
          <div className="mt-1 space-y-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
            <span className="block">{slideList.length} slides</span>
            <span className="block text-slate-400/80">Synced {formattedSyncedAt}</span>
          </div>
        </div>

        <div className="flex-1 basis-0 overflow-hidden">
          <div className="h-full w-full overflow-x-auto overflow-y-hidden">
            <div className="flex min-w-max items-stretch gap-3 pr-1 pb-1">
              {slideTiles}
              <button
                onClick={createNewSlide}
                disabled={!deckId || isCreatingSlide}
                className={`${tileBase} shrink-0 rounded-2xl border border-dashed border-white/35 bg-white/55 text-sm font-semibold text-[var(--color-violet)] transition-all duration-200 hover:border-white/50 hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/70">
                  {isCreatingSlide ? (
                    <svg className="h-4 w-4 animate-spin text-[var(--color-violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-[var(--color-violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v12m6-6H6" />
                    </svg>
                  )}
                </div>
                {isCreatingSlide ? 'Composing…' : 'Compose slide'}
                <span className="mt-1 block text-[11px] text-slate-500">Powered by AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 