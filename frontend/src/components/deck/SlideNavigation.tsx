interface SlideNavigationProps {
  slides?: Array<{ id: string; title: string; isActive?: boolean }>;
}

export function SlideNavigation({ slides = [] }: SlideNavigationProps) {
  // Mock data for now
  const mockSlides = slides.length > 0 ? slides : [
    { id: '1', title: 'Title Slide', isActive: true },
    { id: '2', title: 'Problem', isActive: false },
    { id: '3', title: 'Solution', isActive: false },
  ];

  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">Slides</h2>
        <span className="text-xs text-gray-500">{mockSlides.length} slides</span>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <div className="flex space-x-2 min-w-max">
          {mockSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={`
                group relative flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[100px]
                ${slide.isActive 
                  ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md hover:bg-white'
                }
              `}
            >
              <div className={`
                w-12 h-8 rounded-md mb-1 flex items-center justify-center text-xs font-semibold
                ${slide.isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-white text-gray-500 group-hover:bg-gray-100'
                }
              `}>
                {index + 1}
              </div>
              <span className={`
                text-xs font-medium text-center truncate w-full
                ${slide.isActive ? 'text-blue-900' : 'text-gray-600'}
              `}>
                {slide.title}
              </span>
            </button>
          ))}
          
          <button className="group flex flex-col items-center p-2 rounded-lg border border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 min-w-[100px]">
            <div className="w-12 h-8 rounded-md mb-1 flex items-center justify-center bg-gray-50 group-hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  )
} 