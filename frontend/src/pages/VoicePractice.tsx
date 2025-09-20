import { useNavigate } from 'react-router-dom'

export function VoicePractice() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Practice</h1>
            <p className="text-gray-600">Practice your pitch with AI-powered feedback</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Practice Interface */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Practice?</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Practice your pitch delivery with our AI voice assistant. Get real-time feedback on pace, clarity, and content.
            </p>
            
            <div className="space-y-4">
              <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg">
                Start Voice Practice
              </button>
              <div className="text-sm text-gray-500">
                Voice integration coming soon with Vapi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 