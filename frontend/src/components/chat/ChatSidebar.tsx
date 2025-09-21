export function ChatSidebar() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="px-6 py-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 border-b border-gray-200/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-slate-600 font-medium">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-5 border border-gray-200/60 shadow-sm">
          <p className="text-gray-800 leading-relaxed">
            👋 Hi! I'm here to help you create an amazing pitch deck. What's your startup idea?
          </p>
        </div>
        
        {/* Suggested Actions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</p>
          </div>
          
          <button className="w-full text-left p-4 rounded-xl border border-gray-200/80 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:border-slate-300 focus:bg-slate-50 active:bg-slate-100 transition-all duration-200 group shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 group-hover:text-slate-900">Create title slide</div>
                <div className="text-xs text-gray-500 mt-1">Generate a compelling title for your deck</div>
              </div>
            </div>
          </button>
          
          <button className="w-full text-left p-4 rounded-xl border border-gray-200/80 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:border-slate-300 focus:bg-slate-50 active:bg-slate-100 transition-all duration-200 group shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 group-hover:text-slate-900">Define the problem</div>
                <div className="text-xs text-gray-500 mt-1">Identify the key problem you're solving</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-6 bg-gradient-to-t from-slate-50 to-white border-t border-gray-200/80">
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Describe your startup idea..."
            className="flex-1 px-4 py-3 bg-white border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:border-slate-300 focus:ring-0 shadow-sm transition-all duration-200"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 active:from-slate-800 active:to-slate-900 focus:outline-none active:scale-95 transition-all duration-150 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 