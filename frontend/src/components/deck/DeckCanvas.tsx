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
    if (!deckId) return;
    
    const interval = setInterval(async () => {
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        setSlides(result || []);
      } catch (error) {
        // Silently fail for background updates
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [deckId]);

  const currentSlide = slides[activeSlideIndex];

  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Canvas Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentSlide ? currentSlide.title : 'No Slide Selected'}
          </h3>
          <p className="text-sm text-gray-500">
            {slides.length > 0 ? `Slide ${activeSlideIndex + 1} of ${slides.length}` : '0 slides'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="h-[calc(100%-81px)] flex items-center justify-center p-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {isLoading ? (
          // Loading state
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Loading slides...</p>
          </div>
        ) : currentSlide ? (
          // Show actual slide content
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 min-h-[500px]">
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center leading-tight">
                {currentSlide.title}
              </h1>
              <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                {currentSlide.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Empty state - no slides
          <div className="text-center max-w-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Create Your First Slide</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Start by asking the AI assistant to help you create compelling content for your pitch deck.
            </p>
            <button className="bg-black/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-black/90 active:bg-black/95 focus:outline-none active:scale-95 transition-all duration-150 shadow-lg hover:shadow-2xl border border-white/10">
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 