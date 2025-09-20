export function DeckCanvas() {
  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="h-full flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your slide will appear here</h3>
          <p className="text-gray-500 text-sm">Start by asking the AI to create your first slide</p>
        </div>
      </div>
    </div>
  )
} 