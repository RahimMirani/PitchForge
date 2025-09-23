import { useState, useEffect } from 'react';

interface SlideNavigationProps {
  deckId?: string | null;
  activeSlideIndex?: number;
  onSlideSelect?: (index: number) => void;
}

interface Slide {
  _id: string;
  title: string;
  content: string;
  order: number;
}

export function SlideNavigation({ deckId, activeSlideIndex = 0, onSlideSelect }: SlideNavigationProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);

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

  // Auto-refresh slides every 2 seconds when deck is active (for real-time updates)
  useEffect(() => {
    if (!deckId) return;
    
    const interval = setInterval(async () => {
      try {
        const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
        setSlides(result || []);
      } catch (error) {
        // Silently fail for background updates
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [deckId]);

  const createNewSlide = async () => {
    if (!deckId || isCreatingSlide) return;
    
    setIsCreatingSlide(true);
    try {
      const slideId = await makeMutationCall('slides:createSlide', {
        deckId: deckId,
        title: `New Slide ${slides.length + 1}`,
        content: 'Click edit to add content to this slide.',
      });

      // Refresh slides to show the new slide
      const result = await makeApiCall('slides:getSlidesByDeck', { deckId });
      setSlides(result || []);
      
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

  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-medium text-gray-700">Slides</h2>
          <span className="text-xs text-gray-500">
            {isLoading ? 'Loading...' : `${slides.length} slides`}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none active:text-gray-700 transition-colors">
            Export
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none active:bg-gray-900 active:scale-95 transition-all duration-150">
            Save Deck
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <div className="flex space-x-2 min-w-max">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <button
                key={slide._id}
                onClick={() => onSlideSelect?.(index)}
                className={`
                  group relative flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[100px] focus:outline-none active:scale-95
                  ${index === activeSlideIndex
                    ? 'bg-black/5 border border-black/20 shadow-sm' 
                    : 'bg-gray-50 border border-gray-100 hover:border-black/20 hover:shadow-md hover:bg-white'
                  }
                `}
              >
                <div className={`
                  w-12 h-8 rounded-md mb-1 flex items-center justify-center text-xs font-semibold
                  ${index === activeSlideIndex
                    ? 'bg-black text-white' 
                    : 'bg-white text-gray-500 group-hover:bg-gray-100'
                  }
                `}>
                  {index + 1}
                </div>
                <span className={`
                  text-xs font-medium text-center truncate w-full
                  ${index === activeSlideIndex ? 'text-black' : 'text-gray-600'}
                `}>
                  {slide.title}
                </span>
              </button>
            ))
          ) : (
            !isLoading && (
              <div className="flex items-center justify-center min-w-[200px] py-4 text-gray-500 text-sm">
                No slides yet. Ask AI to create one!
              </div>
            )
          )}
          
          <button 
            onClick={createNewSlide}
            disabled={!deckId || isCreatingSlide}
            className="group flex flex-col items-center p-2 rounded-lg border border-dashed border-gray-200 hover:border-black/30 hover:bg-black/5 focus:outline-none active:scale-95 transition-all duration-200 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-8 rounded-md mb-1 flex items-center justify-center bg-gray-50 group-hover:bg-black/10 transition-colors">
              {isCreatingSlide ? (
                <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 group-hover:text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-black/70">
              {isCreatingSlide ? 'Creating...' : 'Add Slide'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
} 