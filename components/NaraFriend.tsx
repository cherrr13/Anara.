
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, MoodEntry, Habit, JournalEntry } from '../types.ts';
import { SparklesIcon, BackIcon } from './icons.tsx';

type Message = { sender: 'user' | 'ai'; text: string; };

const AIMessageBody: React.FC<{ text: string }> = ({ text }) => {
  // Enhanced parser for specific formatting requested by the user
  const parseText = (content: string) => {
    // 1. Remove any potential double-underscores or similar legacy markdown underlining artifacts
    let cleanContent = content.replace(/__(.*?)__/g, '$1');
    
    const processBold = (items: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      items.forEach(item => {
        if (typeof item !== 'string') {
          result.push(item);
          return;
        }
        const parts = item.split(/\*\*(.*?)\*\*/g);
        parts.forEach((part, i) => {
          result.push(i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part);
        });
      });
      return result;
    };

    const processItalic = (items: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      items.forEach(item => {
        if (typeof item !== 'string') {
          result.push(item);
          return;
        }
        const parts = item.split(/_(.*?)_/g);
        parts.forEach((part, i) => {
          result.push(i % 2 === 1 ? <em key={i} className="italic">{part}</em> : part);
        });
      });
      return result;
    };

    let processed: React.ReactNode[] = [cleanContent];
    processed = processBold(processed);
    processed = processItalic(processed);

    return processed;
  };

  const blocks = text.split('\n\n');
  return (
    <div className="text-sm space-y-3 leading-relaxed">
      {blocks.map((block, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {parseText(block)}
        </p>
      ))}
    </div>
  );
};

interface NaraFriendProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    appData: {
        moodHistory: MoodEntry[];
        habits: Habit[];
        journalEntries: JournalEntry[];
    };
    onJournalEntry: any;
}

const NaraFriend: React.FC<NaraFriendProps> = ({ isOpen, onClose, user, appData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !messages.length) {
            setMessages([{ sender: 'ai', text: `Hi ${user?.name || 'Friend'}! I'm Nara. I can help with stories, wellness consultation, or just listen. I'm fluent in English, Indonesian, Arabic, Korean, and German. How can I support your peace today?` }]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        const currentMessages = [...messages, { sender: 'user', text: userText }];
        setMessages(currentMessages as Message[]);
        setInput('');
        setIsLoading(true);

        try {
            // Initializing new client for every request to ensure fresh API key context
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const latestMood = appData.moodHistory[0]?.mood || 'Not Set';
            const habitStats = `${appData.habits.filter(h => h.completed).length}/${appData.habits.length}`;
            
            // Limit history context for performance and relevance
            const history = currentMessages.slice(-8).map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-3-pro-preview',
                contents: history,
                config: {
                    systemInstruction: `You are Nara, a world-class wellness companion. 
                    
                    USER CONTEXT:
                    - Name: ${user?.name}
                    - Latest Mood: ${latestMood}
                    - Today's Habit Progress: ${habitStats}
                    
                    FORMATTING PROTOCOL (STRICT):
                    1. NO UNDERLINING: Never use underlines in responses.
                    2. ITALICS: Always use _italics_ for:
                       - Titles of major works (books like _The Alchemist_, films, artwork).
                       - Foreign language words (e.g., _ikigai_, _shalom_).
                       - Names of transportation vehicles (ships like _Titanic_, trains, spacecraft).
                    3. BOLDING: Use **bold** ONLY for sub-points when an answer requires a list or breakdown. Avoid bolding single words or sentences unnecessarily.
                    4. TONE: 
                       - Casual/Comfortable: If the user is venting or sharing emotions.
                       - Direct/Clear: If the user is asking a specific question or seeking advice.
                    5. CONCISENESS: Keep responses extremely brief (2-3 sentences max) unless a longer explanation is truly necessary for health/safety.
                    
                    If user input is a word referring to itself (e.g. "Define the word peace"), respond in a suitable tone and word choice for self-reference.`,
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            });

            // Add placeholder AI message
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            let fullResponse = '';
            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullResponse += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg && lastMsg.sender === 'ai') {
                            lastMsg.text = fullResponse;
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Nara AI Error:", error);
            setMessages(prev => {
                const updated = [...prev];
                // Remove the empty message if it exists
                if (updated[updated.length - 1].text === '') {
                    updated.pop();
                }
                return [...updated, { sender: 'ai', text: "I'm having a quiet moment. Let's try connecting again in a moment." }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in border border-white/20">
                <header className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sakura-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold font-serif text-xl text-gray-800 dark:text-slate-100">Nara</h2>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered by Pro</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                        <BackIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin bg-gray-50/30 dark:bg-slate-900/30">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm animate-pop ${
                                m.sender === 'user' 
                                ? 'bg-sakura-500 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-tl-none border border-gray-100 dark:border-slate-600'
                            }`}>
                                <AIMessageBody text={m.text || (isLoading && i === messages.length - 1 ? '...' : '')} />
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSend()} 
                            className="flex-1 p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-sakura-300 dark:text-slate-100 transition-all"
                            placeholder="Ask me anything..." 
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={isLoading || !input.trim()}
                            className="bg-sakura-500 text-white px-6 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaraFriend;
