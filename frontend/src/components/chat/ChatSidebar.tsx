export function ChatSidebar() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
        <p className="text-xs text-gray-500 mt-1">Ask me to help build your pitch deck</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            Hi! I'm here to help you create an amazing pitch deck. What's your startup idea?
          </p>
        </div>
        
        {/* Suggested Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suggested actions</p>
          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Create title slide</div>
            <div className="text-xs text-gray-500 mt-1">Generate a compelling title for your deck</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Define the problem</div>
            <div className="text-xs text-gray-500 mt-1">Identify the key problem you're solving</div>
          </button>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  )
} 