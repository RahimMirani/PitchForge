interface HeaderProps {
  title?: string;
}

export function Header({ title = "PitchForge" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Save Deck
          </button>
        </div>
      </div>
    </header>
  )
} 