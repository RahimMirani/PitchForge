import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const navigate = useNavigate()

  // Mock data for now
  const mockDecks = [
    { id: '1', title: 'FinTech Startup', createdAt: '2024-01-15', slides: 12 },
    { id: '2', title: 'AI SaaS Platform', createdAt: '2024-01-10', slides: 8 },
    { id: '3', title: 'E-commerce Solution', createdAt: '2024-01-05', slides: 10 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Pitch Decks</h1>
          <p className="text-gray-600">Create and manage your startup presentations</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Create New Deck
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            Practice with Voice
          </button>
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/create')}
            >
              <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{deck.title}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{deck.slides} slides</span>
                <span>{deck.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 