import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';
import { useAction } from 'convex/react';
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
  const getVapiConfig = useAction(api.voiceai.getVapiAssistantConfig);

  useEffect(() => {
    let vapi: Vapi | null = null;

    const runSession = async () => {
      try {
        const config = await getVapiConfig({
          firmTag: selectedFirmTag,
          deckOption: selectedDeckOption,
        });

        if (!config) {
          setCallStatus('Error: No config received');
          return;
        }

        setCallStatus('Initializing call...');
        vapi = new Vapi(VAPI_PUBLIC_KEY);

        vapi.on('call-start', () => {
          setCallStatus('Connected');
        });

        vapi.on('call-end', () => {
          setCallStatus('Session Ended');
          onSessionEnd();
        });

        vapi.on('message', (message) => {
          if (
            message.type === 'transcript' &&
            message.transcriptType === 'final'
          ) {
            setConversation((prev) => [...prev, { role: message.role, content: message.transcript }]);
          } else if (message.type === 'message' && message.messageType === 'final') {
            setConversation((prev) => [...prev, { role: message.role, content: message.message }]);
          }
        });

        vapi.start(config);
      } catch (error) {
        console.error('Error starting Vapi session:', error);
        setCallStatus('Error');
      }
    };

    runSession();

    return () => {
      vapi?.stop();
    };
  }, [selectedFirmTag, selectedDeckOption, onSessionEnd, getVapiConfig]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-8 text-white">
        <h2 className="text-2xl font-semibold">Voice Practice Session</h2>
        <p className="mt-2 text-slate-400">
          VC Persona: <span className="font-medium text-white">{selectedFirmTag}</span>
        </p>

        <div className="mt-6 h-64 overflow-y-auto rounded-lg bg-slate-950/50 p-4">
          {conversation.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                <p className="text-sm text-white">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium">
            Status: <span className="text-yellow-400">{callStatus}</span>
          </p>
          <button
            onClick={onSessionEnd}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
