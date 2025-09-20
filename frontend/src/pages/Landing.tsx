import { useNavigate } from 'react-router-dom'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PitchForge</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Turn your startup idea into a VC-ready pitch deck with AI assistance
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Sign In
        </button>
      </div>
    </div>
  )
} 