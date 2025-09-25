import { useState, useEffect } from 'react';

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
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // API call function
  const makeApiCall = async (functionName: string, args: any) => {
    try {
      const response = await fetch(`https://fastidious-mosquito-435.convex.cloud/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: functionName,
          args: args,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.value || result;
    } catch (error) {
      console.error(`API call to ${functionName} failed:`, error);
      throw error;
    }
  };

  const makeMutationCall = async (functionName: string, args: any) => {
    try {
      const response = await fetch(`https://fastidious-mosquito-435.convex.cloud/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: functionName,
          args: args,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mutation call failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.value || result;
    } catch (error) {
      console.error(`Mutation call to ${functionName} failed:`, error);
      throw error;
    }
  };

  // Load slides when deckId changes
  useEffect(() => {
    const loadSlides = async () => {
      if (!deckId) {
        setSlides([]);
        setLastSyncedAt(null);
        return;
      }

      setIsLoading(true);
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        const list = result || [];
        setSlides(list);
        setLastSyncedAt(new Date());
      } catch (error) {
        console.error('Failed to load slides:', error);
        setSlides([]);
        setLastSyncedAt(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, [deckId]);

  // Auto-refresh slides every 2 seconds when deck is active (for real-time updates)
  useEffect(() => {
    if (!deckId) return;

    const interval = setInterval(async () => {
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        const list = result || [];
        setSlides(list);
        setLastSyncedAt(new Date());
      } catch (error) {
        // Silently fail for background updates
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deckId]);

  const createNewSlide = async () => {
    if (!deckId || isCreatingSlide) {
      return;
    }
    
    setIsCreatingSlide(true);
    try {
      const slideId = await makeMutationCall('slides:createSlide', {
        deckId: deckId,
        title: `New Slide ${slides.length + 1}`,
        content: 'Click edit to add content to this slide.',
      });

      // Refresh slides to show the new slide
      const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
      const list = result || [];
      setSlides(list);
      setLastSyncedAt(new Date());
      
      // Select the new slide (it will be the last one)
      const newSlideIndex = (result?.length || 1) - 1;
      onSlideSelect?.(newSlideIndex);
      
    } catch (error) {
      console.error('Failed to create slide:', error);
      alert('Failed to create slide. Please try again.');
    } finally {
      setIsCreatingSlide(false);
    }
  };

  const slideGradients = [
    'from-[rgba(97,81,255,0.12)] via-white to-white',
    'from-[rgba(63,209,201,0.12)] via-white to-white',
    'from-[rgba(255,111,97,0.12)] via-white to-white',
    'from-[rgba(14,116,144,0.14)] via-white to-white',
  ];

  const tileHeight = 'h-[110px]';
  const tileWidth = 'w-[170px]';
  const tilesPadding = 'px-4 py-3';

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className={`${tileWidth} ${tileHeight} rounded-2xl bg-white/60 border border-[var(--border-subtle)] shadow-sm animate-pulse`}
      />
    ))
  );

  const formattedSyncedAt = lastSyncedAt
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(lastSyncedAt)
    : 'syncing…';

  const slideTiles = isLoading
    ? renderSkeletons()
    : slides.length > 0
      ? slides.map((slide, index) => {
          const gradient = slideGradients[index % slideGradients.length];
          const isActive = index === activeSlideIndex;

          return (
            <button
              key={slide._id}
              onClick={() => onSlideSelect?.(index)}
              className={`group relative ${tileWidth} ${tileHeight} rounded-2xl border backdrop-blur-sm transition-all duration-200 text-left ${tilesPadding} flex flex-col justify-between focus:outline-none ${
                isActive
                  ? 'border-[rgba(97,81,255,0.45)] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]'
                  : 'border-[var(--border-subtle)] bg-white/70 hover:border-[rgba(63,209,201,0.45)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl pointer-events-none opacity-70 bg-gradient-to-br ${gradient}`} />
              <div className="relative flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/70 text-[var(--color-violet)]">
                  {index + 1}
                </span>
              </div>
              <div className="relative">
                <p className={`text-sm font-semibold leading-tight line-clamp-2 ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {slide.title}
                </p>
                <p className="mt-2 text-[11px] text-slate-500/80 line-clamp-2">
                  {slide.content ? slide.content.slice(0, 70) + (slide.content.length > 70 ? '…' : '') : 'Tap to craft details'}
                </p>
              </div>
              {isActive ? (
                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[var(--color-violet)] via-[var(--color-aqua)] to-[var(--color-violet)] rounded-full" />
              ) : null}
            </button>
          );
        })
      : (
        <div className={`flex flex-col justify-center items-center ${tileWidth} ${tileHeight} rounded-2xl border border-dashed border-[rgba(97,81,255,0.3)] bg-white/60 text-center text-[12px] text-slate-500 shadow-inner`}>
          <span className="text-[var(--color-violet)] font-semibold mb-1">No slides yet</span>
          Ask the AI assistant to draft your opening slide.
        </div>
      );

  return (
    <div className="w-full overflow-hidden bg-white/85 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl shadow-[0_18px_38px_rgba(11,18,32,0.08)] px-5 py-3 h-[164px]">
      <div className="flex h-full items-stretch gap-5">
        <div className="flex-shrink-0 pr-6 border-r border-[var(--border-subtle)]/60 space-y-1.5">
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            {deckTitle}
          </h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[rgba(97,81,255,0.12)] text-[11px] font-medium text-[var(--color-violet)]">
            {slides.length} slides
          </span>
          <span className="block text-[11px] text-slate-500">Synced {formattedSyncedAt}</span>
        </div>

        <div className="flex-1 basis-0 overflow-hidden min-w-0">
          <div className="h-full w-full overflow-x-auto overflow-y-hidden">
            <div className="flex items-stretch gap-3 flex-nowrap min-w-max pr-2 pb-1 max-w-full">
              {slideTiles}
              <button
                onClick={createNewSlide}
                disabled={!deckId || isCreatingSlide}
                className={`shrink-0 ${tileWidth} ${tileHeight} rounded-2xl border border-dashed border-[rgba(97,81,255,0.35)] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center ${tilesPadding} text-sm font-medium text-[var(--color-violet)] hover:border-[rgba(63,209,201,0.45)] hover:text-[var(--color-aqua)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(97,81,255,0.12)] mb-2">
                  {isCreatingSlide ? (
                    <svg className="w-4 h-4 text-[var(--color-violet)] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <span>{isCreatingSlide ? 'Composing…' : 'Compose slide'}</span>
                <span className="text-[11px] text-slate-500 mt-1">Powered by AI</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-stretch gap-2 justify-center" />
      </div>
    </div>
  )
} 