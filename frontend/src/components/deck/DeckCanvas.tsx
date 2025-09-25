import { useState, useEffect } from 'react';

interface DeckCanvasProps {
  deckId?: string | null;
  activeSlideIndex?: number;
}

interface Slide {
  _id: string;
  title: string;
  content: string;
  order: number;
}

export function DeckCanvas({ deckId, activeSlideIndex = 0 }: DeckCanvasProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // API call functions
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
        return;
      }
      
      setIsLoading(true);
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        setSlides(result || []);
      } catch (error) {
        console.error('Failed to load slides:', error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSlides();
  }, [deckId]);

  // Auto-refresh slides every 3 seconds for real-time updates
  useEffect(() => {
    if (!deckId || isEditing) return; // Don't refresh while editing
    
    const interval = setInterval(async () => {
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        setSlides(result || []);
      } catch (error) {
        // Silently fail for background updates
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [deckId, isEditing]);

  const currentSlide = slides[activeSlideIndex];

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
    if (!currentSlide || !deckId) return;
    
    setIsSaving(true);
    try {
      await makeMutationCall('slides:updateSlide', {
        slideId: currentSlide._id,
        content: editContent,
      });

      // If title changed, we need a separate update (if we add title update to the mutation)
      // For now, we'll just update content

      // Refresh slides to show updated content
      const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
      setSlides(result || []);
      
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
    if (!currentSlide || !deckId) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${currentSlide.title}"?`);
    if (!confirmDelete) return;
    
    try {
      await makeMutationCall('slides:deleteSlide', {
        slideId: currentSlide._id,
      });

      // Refresh slides
      const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
      setSlides(result || []);
    } catch (error) {
      console.error('Failed to delete slide:', error);
      alert('Failed to delete slide. Please try again.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col rounded-3xl border border-[rgba(97,81,255,0.15)] bg-white shadow-[0_30px_80px_rgba(11,18,32,0.12)] overflow-hidden">

      {/* Canvas Header */}
      <div className="relative flex items-center justify-between px-8 py-5 border-b border-black/10 bg-white">
        <div className="flex items-start gap-3">
          <div className="flex flex-col">
            <span className="inline-flex items-center text-[12px] font-medium text-[var(--color-violet)]">{slides.length > 0 ? `Slide ${activeSlideIndex + 1}` : 'No slides'}</span>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
              {currentSlide ? currentSlide.title : 'Select or create a slide'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{slides.length > 0 ? `${slides.length} total slides` : 'Start crafting your story with AI'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentSlide ? (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${isEditing ? 'bg-[rgba(97,81,255,0.12)] text-[var(--color-violet)]' : 'bg-[rgba(63,209,201,0.12)] text-[var(--color-aqua)]'}`}>
              {isEditing ? 'Editing' : 'Viewing'}
            </span>
          ) : null}
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-[rgba(17,24,39,0.12)] to-transparent" />
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="px-3.5 py-1.5 rounded-full border border-black text-xs font-semibold text-slate-700 hover:bg-black hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSlide}
                  disabled={isSaving}
                  className="px-4.5 py-1.5 rounded-full border border-black bg-black text-white text-xs font-semibold hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save slide'}
                </button>
              </>
            ) : currentSlide ? (
              <>
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black text-xs font-semibold text-slate-700 hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16.862 4.487l1.651 1.651a2 2 0 010 2.828l-8.21 8.21-3.715.413a1 1 0 01-1.106-1.106l.413-3.715 8.21-8.21a2 2 0 012.828 0z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={deleteSlide}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black bg-white text-[var(--color-coral)] text-xs font-semibold hover:bg-[rgba(255,111,97,0.15)] transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-6 rounded-2xl border border-dashed border-[rgba(17,24,39,0.07)] pointer-events-none" />
        <div className="relative h-full overflow-y-auto px-6 py-8">
          <div className="mx-auto w-full max-w-[1200px]">
            {isLoading ? (
              <div className="w-full space-y-6">
                <div className="h-7 w-48 bg-white/60 rounded-full animate-pulse" />
                <div className="h-[360px] bg-white/70 rounded-2xl border border-[rgba(17,24,39,0.08)] shadow-[0_22px_50px_rgba(15,23,42,0.15)] animate-pulse" />
              </div>
            ) : currentSlide ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-white/40 to-transparent rounded-[28px] blur-lg" />
                <div className="relative bg-white rounded-[24px] border border-[rgba(17,24,39,0.08)] shadow-[0_24px_48px_rgba(15,23,42,0.18)] px-8 py-8">
                  {isEditing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Slide Title</label>
                          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[rgba(17,24,39,0.12)] bg-white px-4 py-2.5 focus-within:border-[var(--color-violet)] focus-within:ring-2 focus-within:ring-[var(--color-violet)]/30">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 bg-transparent text-[22px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                              placeholder="Problem & Opportunity"
                            />
                            <span className="text-[11px] text-slate-400">{editTitle.length}/120</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Narrative</label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="mt-2 w-full h-[220px] resize-none rounded-2xl border border-[rgba(17,24,39,0.12)] bg-white px-4 py-4 text-base text-slate-700 leading-relaxed focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)]/25"
                            placeholder="Detail the insight, your solution, supporting metrics, and next steps."
                          />
                        </div>
                      </div>
                      <div className="hidden lg:flex flex-col gap-4 p-5 rounded-2xl border border-[rgba(17,24,39,0.08)] bg-gradient-to-br from-white to-[rgba(97,81,255,0.08)]/60 min-h-[220px]">
                        <h4 className="text-sm font-semibold text-slate-700">AI Suggestions</h4>
                        <p className="text-xs text-slate-500">Ask the assistant for bullet points, structure, or investor-focused highlights.</p>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-aqua)]/20 text-[var(--color-aqua)] text-sm font-semibold hover:bg-[var(--color-aqua)]/30 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3v6m0 6v6m6-6h-6m-6 0H3" />
                          </svg>
                          Ask AI to improve this slide
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">
                          {currentSlide.title}
                        </h1>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-black bg-white text-[12px] font-semibold text-slate-800 uppercase tracking-[0.18em]">
                          Investor ready
                        </span>
                      </div>
                      <div className="space-y-4 text-[16px] leading-relaxed text-slate-700">
                        {currentSlide.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="relative pl-6">
                            <span className="absolute left-0 top-2 inline-block w-2 h-2 rounded-full bg-[var(--color-violet)]" />
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative max-w-2xl mx-auto text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-[24px] bg-gradient-to-br from-[rgba(97,81,255,0.25)] via-[rgba(63,209,201,0.18)] to-white shadow-[0_25px_60px_rgba(15,23,42,0.12)] flex items-center justify-center">
                  <svg className="blck w-11 h-11 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Summon your first slide</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Tap the AI assistant to generate a compelling opener, or compose one manually to kickstart your deck.
                </p>
                <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--color-violet)] text-white text-sm font-semibold shadow-[0_18px_40px_rgba(97,81,255,0.35)] hover:shadow-[0_24px_50px_rgba(97,81,255,0.45)] transition">
                  <svg className="w-5 h-5" fill="none" stroke="black" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                  Ask AI to create slide
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 