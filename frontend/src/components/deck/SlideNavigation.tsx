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
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Slides</h2>
        <span className="text-sm text-gray-500">{mockSlides.length} slides</span>
      </div>
      
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        <div className="flex space-x-3 min-w-max">
          {mockSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={`
                group relative flex flex-col items-center p-4 rounded-xl transition-all duration-200 min-w-[140px]
                ${slide.isActive 
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                  : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-md'
                }
              `}
            >
              <div className={`
                w-16 h-12 rounded-lg mb-3 flex items-center justify-center text-xs font-bold
                ${slide.isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }
              `}>
                {index + 1}
              </div>
              <span className={`
                text-sm font-medium text-center
                ${slide.isActive ? 'text-blue-900' : 'text-gray-700'}
              `}>
                {slide.title}
              </span>
            </button>
          ))}
          
          <button className="group flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 min-w-[140px]">
            <div className="w-16 h-12 rounded-lg mb-3 flex items-center justify-center bg-gray-50 group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  )
} 