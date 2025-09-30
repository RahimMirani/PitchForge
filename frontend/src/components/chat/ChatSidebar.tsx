import { useEffect, useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface ChatSidebarProps {
  deckId: string | null;
}

interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const suggestedPrompts = [
  'Draft a compelling problem slide with market stats',
  'Summarize our traction in bullet points',
  'Write an investor-friendly product overview',
]

export function ChatSidebar({ deckId }: ChatSidebarProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messages = useQuery(api.messages.getMessages, deckId ? { deckId } : undefined);
  const sendMessage = useMutation(api.messages.sendMessage);
  const chatWithAI = useAction(api.ai.chatWithAI);
  const messageList = messages ?? [];
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!queuedPrompt || isLoading) return;
    const nextPrompt = queuedPrompt;
    setQueuedPrompt(null);
    void (async () => {
      setInputMessage(nextPrompt);
      await handleSendMessage(nextPrompt);
    })();
  }, [queuedPrompt, isLoading]);

  const handleSendMessage = async (messageOverride?: string) => {
    const messageToSend = (messageOverride ?? inputMessage).trim();
    if (!messageToSend || !deckId || isLoading) return;

    if (!messageOverride) {
      setInputMessage('');
    }
    setIsLoading(true);

    try {
      await sendMessage({
        deckId,
        role: 'user',
        content: messageToSend,
      });

      await chatWithAI({
        deckId,
        userMessage: messageToSend,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      if (!messageOverride) {
        setInputMessage(messageToSend);
      }
      alert('Failed to send message. Please try again.');
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

  const handleQuickAction = (message: string) => {
    if (!deckId || isLoading) return;

    setQueuedPrompt(message);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white/85 text-slate-900 backdrop-blur-xl">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/10">
            <svg className="h-6 w-6 text-[var(--color-violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m8-9h1M3 12H2m16.364-6.364l.707-.707M4.929 19.071l-.707.707m15.142-.707l-.707.707M4.222 4.222l-.707-.707M12 7a5 5 0 00-3.535 8.535l-1.06 2.121 2.121-1.06A5 5 0 1012 7z" />
            </svg>
            <span
              className={`absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full border border-white ${
                isLoading ? 'bg-amber-300 animate-ping' : 'bg-[var(--color-aqua)]'
              }`}
            />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">PitchForge Copilot</h3>
            <p className="text-xs text-slate-500">{isLoading ? 'Synthesising insights…' : 'Ready to collaborate'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messageList.length > 0 ? (
          messageList.map((message) => (
            <div
              key={message._id}
              className={`group relative max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                message.role === 'user'
                  ? 'ml-auto border-[var(--color-violet)]/30 bg-[var(--color-violet)]/12 text-slate-900'
                  : 'mr-auto border-slate-200 bg-white text-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.32em] text-slate-400">
                {message.role === 'user' ? 'You' : 'Copilot'}
              </div>
              <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' ? (
                <div className="mt-3 hidden gap-2 text-[11px] text-slate-500 group-hover:flex">
                  <button className="rounded-full border border-slate-200 px-2 py-1 transition hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]">
                    Add to slide
                  </button>
                  <button className="rounded-full border border-slate-200 px-2 py-1 transition hover:border-[var(--color-aqua)] hover:text-[var(--color-aqua)]">
                    Ask follow-up
                  </button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 text-center shadow-[0_20px_60px_rgba(8,15,31,0.12)]">
            <h4 className="text-sm font-semibold text-slate-900">Kickstart your conversation</h4>
            <p className="mt-2 text-xs text-slate-500">
              Share your startup idea or try a smart suggestion to help the copilot shape your deck.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickAction(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-600 transition hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mr-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" style={{ animationDelay: '0.12s' }} />
              <span className="h-2 w-2 rounded-full bg-[var(--color-aqua)] animate-bounce" style={{ animationDelay: '0.24s' }} />
            </span>
            Thinking…
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/80 px-6 py-5">
        {!deckId ? (
          <div className="text-center text-sm text-slate-400">Select a deck to unlock the copilot.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end">
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_16px_40px_rgba(8,15,31,0.15)] focus-within:border-[var(--color-violet)] focus-within:ring-2 focus-within:ring-[var(--color-violet)]/25">
                <div className="flex items-end gap-3">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you need help with…"
                    disabled={isLoading}
                    rows={2}
                    className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-aqua)] to-[var(--color-violet)] text-white shadow-[0_18px_45px_rgba(97,81,255,0.35)] transition hover:shadow-[0_22px_55px_rgba(97,81,255,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0-8v8" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Powered by AI</span>
                  <span>{inputMessage.length}/1000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 