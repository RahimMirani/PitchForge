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
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-1 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {mockSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${slide.isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xs font-medium">{index + 1}</span>
              <span>{slide.title}</span>
            </button>
          ))}
          
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  )
} 