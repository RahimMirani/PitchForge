import Vapi from '@vapi-ai/web';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../../backend/convex/_generated/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Replace with your Vapi Public Key
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

interface VapiSessionProps {
  onSessionEnd: () => void;
  selectedFirmTag: string;
  selectedDeckOption: string;
}

export function VapiSession({ onSessionEnd, selectedFirmTag, selectedDeckOption }: VapiSessionProps) {
  const [callStatus, setCallStatus] = useState('Fetching session details...');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const getVapiConfig = useAction(api.voiceai.getVapiAssistantConfig);
  const saveConversation = useMutation(api.voiceai.saveConversation);

  // Use refs to hold the latest state and props for our event handlers.
  // This avoids stale closures and complex dependency arrays.
  const conversationRef = useRef(conversation);
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const latestProps = useRef({ onSessionEnd, saveConversation, selectedFirmTag, selectedDeckOption });
  useEffect(() => {
    latestProps.current = { onSessionEnd, saveConversation, selectedFirmTag, selectedDeckOption };
  }, [onSessionEnd, saveConversation, selectedFirmTag, selectedDeckOption]);

  // These handlers are now stable and will not change across re-renders.
  const onCallStartHandler = useCallback(() => setCallStatus('Connected'), []);

  const onCallEndHandler = useCallback(async () => {
    setCallStatus('Session Ended. Saving...');
    const { onSessionEnd, saveConversation, selectedFirmTag, selectedDeckOption } = latestProps.current;
    try {
      if (conversationRef.current.length > 0) {
        await saveConversation({
          firmTag: selectedFirmTag,
          deckId: selectedDeckOption !== 'freestyle' ? selectedDeckOption : undefined,
          transcript: conversationRef.current,
        });
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    } finally {
      onSessionEnd();
    }
  }, []);

  const onUnexpectedErrorHandler = useCallback((error: any) => {
    console.error('Vapi error:', error);
    setCallStatus('Error');
  }, []);

  const onMessageHandler = useCallback((message: any) => {
    if (
      (message.type === 'transcript' && message.transcriptType === 'final') ||
      (message.type === 'message' && message.messageType === 'final')
    ) {
      const role = message.role;
      const content = message.type === 'transcript' ? message.transcript : message.message;
      setConversation((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === role) {
          const updatedConversation = [...prev];
          updatedConversation[updatedConversation.length - 1].content += ` ${content}`;
          return updatedConversation;
        } else {
          return [...prev, { role, content }];
        }
      });
    }
  }, []);

  // This effect runs only once on mount to set up and tear down the call.
  useEffect(() => {
    const runSession = async () => {
      try {
        const config = await getVapiConfig({ firmTag: latestProps.current.selectedFirmTag, deckOption: latestProps.current.selectedDeckOption });
        if (!config) {
          setCallStatus('Error: No config received');
          return;
        }
        vapi.on('call-start', onCallStartHandler);
        vapi.on('call-end', onCallEndHandler);
        vapi.on('message', onMessageHandler);
        vapi.on('error', onUnexpectedErrorHandler);
        await vapi.start(config);
      } catch (error) {
        console.error('Error starting Vapi session:', error);
        setCallStatus('Error');
      }
    };
    runSession();
    return () => {
      // Bulletproof cleanup
      vapi.off('call-start', onCallStartHandler);
      vapi.off('call-end', onCallEndHandler);
      vapi.off('message', onMessageHandler);
      vapi.off('error', onUnexpectedErrorHandler);
      vapi.stop();
    };
  }, [getVapiConfig, onCallStartHandler, onCallEndHandler, onMessageHandler, onUnexpectedErrorHandler, vapi]);

  const handleEndSession = () => {
    vapi.stop();
  };

  // Effect for auto-scrolling
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900 p-8 text-white">
        <h2 className="text-2xl font-semibold">Voice Practice Session</h2>
        <p className="mt-2 text-slate-400">
          VC Persona: <span className="font-medium text-white">{selectedFirmTag}</span>
        </p>
        <div ref={transcriptContainerRef} className="mt-6 h-96 space-y-4 overflow-y-auto rounded-lg bg-slate-950/50 p-4">
          {conversation.length === 0 ? (
            <p className="text-sm text-slate-400">Waiting for transcript...</p>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === 'user'
                      ? 'rounded-br-none bg-blue-600 text-white'
                      : 'rounded-bl-none bg-slate-800 text-slate-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium">
            Status: <span className="text-yellow-400">{callStatus}</span>
          </p>
          <button
            onClick={handleEndSession}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
