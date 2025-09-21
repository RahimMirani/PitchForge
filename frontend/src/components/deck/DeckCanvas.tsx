export function DeckCanvas() {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Canvas Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Title Slide</h3>
          <p className="text-sm text-gray-500">Slide 1 of 3</p>
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
      </div>
    </div>
  )
} 