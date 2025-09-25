import { useState, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';

interface ChatSidebarProps {
  deckId: string | null;
}

interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function ChatSidebar({ deckId }: ChatSidebarProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Manual API calls to your Convex backend
  const makeApiCall = async (functionName: string, args: any) => {
    try {
      const response = await fetch(`https://fastidious-mosquito-435.convex.cloud/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: functionName,
          args: args,
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const result = await response.json()
      return result.value || result
    } catch (error) {
      console.error(`API call to ${functionName} failed:`, error)
      throw error
    }
  }

  const makeActionCall = async (functionName: string, args: any) => {
    try {
      const response = await fetch(`https://fastidious-mosquito-435.convex.cloud/api/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: functionName,
          args: args,
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Action call failed: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const result = await response.json()
      return result.value || result
    } catch (error) {
      console.error(`Action call to ${functionName} failed:`, error)
      throw error
    }
  }

  // Load messages when deckId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!deckId) return;
      
      try {
        const result = await makeApiCall('messages:getMessages', { deckId });
        setMessages(result);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    
    loadMessages();
  }, [deckId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !deckId || isLoading) return;
    
    const messageToSend = inputMessage.trim();
    setInputMessage(''); // Clear input immediately
    setIsLoading(true);
    
    // Add user message immediately for better UX
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Call the AI chat function (this is an action)
      const result = await makeActionCall('ai:chatWithAI', {
        deckId,
        userMessage: messageToSend,
      });
      
      // Reload messages to get the actual conversation (this is a query)
      const updatedMessages = await makeApiCall('messages:getMessages', { deckId });
      setMessages(updatedMessages);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the optimistic message and restore input
      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id));
      setInputMessage(messageToSend);
      
      // Show error message
      const errorMessage: Message = {
        _id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (message: string) => {
    if (!deckId || isLoading) return;
    
    // Set the input and trigger send
    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A] text-white border-l border-[rgba(255,255,255,0.08)] shadow-[0_0_45px_rgba(15,23,42,0.35)]">
      {/* Chat Header */}
      <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[rgba(99,102,241,0.85)] to-[rgba(45,212,191,0.7)] flex items-center justify-center shadow-[0_18px_40px_rgba(99,102,241,0.35)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m8-9h1M3 12H2m16.364-6.364l.707-.707M4.929 19.071l-.707.707m15.142-.707l-.707.707M4.222 4.222l-.707-.707M12 7a5 5 0 00-3.535 8.535l-1.06 2.121 2.121-1.06A5 5 0 1012 7z" />
              </svg>
              <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-[#0F172A] ${isLoading ? 'bg-amber-300 animate-pulse' : 'bg-[var(--color-aqua)]'}`} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">PitchForge Copilot</h3>
              <p className="text-xs text-slate-300">{isLoading ? 'Synthesising insights…' : 'Ready to collaborate'}</p>
            </div>
          </div>
          <button className="px-3 py-1 text-xs font-semibold text-slate-200 rounded-full border border-[rgba(255,255,255,0.12)] hover:border-[rgba(99,102,241,0.45)]">
            Timeline
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-[rgba(15,23,42,0.95)] via-[#111b31] to-[#0b1526]">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`group relative max-w-[90%] rounded-2xl px-4 py-3 border text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'ml-auto bg-[rgba(99,102,241,0.15)] border-[rgba(99,102,241,0.35)] text-slate-100 shadow-[0_15px_35px_rgba(99,102,241,0.3)]'
                  : 'mr-auto bg-[rgba(12,22,38,0.85)] border-[rgba(255,255,255,0.05)] text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.45)]'
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.32em] text-slate-400 mb-1">
                {message.role === 'user' ? 'You' : 'Copilot'}
              </div>
              <p className="text-[13px] whitespace-pre-wrap">
                {message.content}
              </p>
              {message.role === 'assistant' ? (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3 flex gap-2 text-[11px] text-slate-300">
                  <button className="px-2 py-1 rounded-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.6)] hover:text-[var(--color-violet)]">Add to slide</button>
                  <button className="px-2 py-1 rounded-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(45,212,191,0.6)] hover:text-[var(--color-aqua)]">Ask follow-up</button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.75)] p-6 text-center shadow-[0_22px_50px_rgba(15,23,42,0.45)]">
            <h4 className="text-sm font-semibold text-white mb-2">Kickstart your conversation</h4>
            <p className="text-xs text-slate-300">Share your startup idea, or pick a smart suggestion below to craft your first slide together.</p>
          </div>
        )}

        {isLoading && (
          <div className="mr-auto inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(12,22,38,0.9)] px-4 py-2 text-xs text-slate-200 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" style={{ animationDelay: '0.12s' }} />
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" style={{ animationDelay: '0.24s' }} />
            </span>
            Thinking…
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="pt-4 pb-5 px-5 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(12,22,38,0.95)]">
        {!deckId ? (
          <div className="text-center text-sm text-slate-400">Select a deck to unlock the copilot.</div>
        ) : (
          <div className="space-y-3">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction('Draft a compelling problem slide for a fintech startup')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 rounded-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(99,102,241,0.6)] hover:text-[var(--color-violet)]"
                >
                  Draft problem slide
                </button>
                <button
                  onClick={() => handleQuickAction('Generate traction metrics copy highlighting month-over-month growth')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 rounded-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(45,212,191,0.6)] hover:text-[var(--color-aqua)]"
                >
                  Traction bullets
                </button>
              </div>
            )}
            <div className="flex items-end">
              <div className="flex-1 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(10,18,32,0.95)] px-4 py-3 shadow-[0_14px_32px_rgba(15,23,42,0.2)] focus-within:border-[rgba(99,102,241,0.6)] focus-within:ring-2 focus-within:ring-[var(--color-violet)]/35">
                <div className="flex gap-3 items-end">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you need help with…"
                    disabled={isLoading}
                    rows={2}
                    className="flex-1 bg-transparent text-sm text-slate-200 resize-none leading-relaxed focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-aqua)] to-[var(--color-violet)] text-white shadow-[0_16px_34px_rgba(99,102,241,0.45)] hover:shadow-[0_20px_42px_rgba(99,102,241,0.55)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0-8v8" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded-full border border-transparent text-slate-400 hover:text-[var(--color-violet)] hover:border-[var(--color-violet)]/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-4 0H5a2 2 0 01-2-2V8a2 2 0 012-2h6a2 2 0 012 2v4z" />
                      </svg>
                    </button>
                    <button className="px-2 py-1 rounded-full border border-transparent text-slate-400 hover:text-[var(--color-aqua)] hover:border-[var(--color-aqua)]/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 14v7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 10v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4" />
                      </svg>
                    </button>
                  </div>
                  <span>{inputMessage.length}/500</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 