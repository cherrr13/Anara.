
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, MoodEntry, Habit, JournalEntry } from '../types.ts';
import { SparklesIcon, BackIcon } from './icons.tsx';

type Message = { sender: 'user' | 'ai'; text: string; };

const AIMessageBody: React.FC<{ text: string }> = ({ text }) => {
  // Enhanced parser for specific formatting requested by the user
  const parseText = (content: string) => {
    // Note: Underlining has been removed per latest instruction.
    // 1. Bold: **text**
    // 2. Italic: _text_
    
    const processBold = (items: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      items.forEach(item => {
        if (typeof item !== 'string') {
          result.push(item);
          return;
        }
        const parts = item.split(/\*\*(.*?)\*\*/g);
        parts.forEach((part, i) => {
          result.push(i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
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
          result.push(i % 2 === 1 ? <em key={i}>{part}</em> : part);
        });
      });
      return result;
    };

    let processed: React.ReactNode[] = [content];
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
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const latestMood = appData.moodHistory[0]?.mood || 'Not Set';
            const habitStats = `${appData.habits.filter(h => h.completed).length}/${appData.habits.length}`;
            
            const history = currentMessages.slice(-6).map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-flash-lite-latest',
                contents: history,
                config: {
                    systemInstruction: `You are Nara, a world-class wellness companion. 
                    
                    CONTEXT:
                    - User: ${user?.name}
                    - Current Mood: ${latestMood}
                    - Today's Rituals: ${habitStats}
                    
                    CORE PROTOCOL:
                    1. CONCISE: Max 2-3 sentences.
                    2. MIRROR & TONE: Use user's language. If venting, be comfortable/casual. If asking specifics, be clear/direct.
                    3. BOLDING: Only bold sub-points in lists/breakdowns. Do NOT bold unnecessarily.
                    4. UNDERLINING: Never use underlining.
                    5. ITALICS: Use _italics_ for:
                       - Titles of major works (books, films, art).
                       - Words in other languages.
                       - Names of vehicles (ships, trains, spacecraft).
                    6. NO MODIFICATION: Do not edit user input; only respond to it.
                    
                    EXAMPLES:
                    - Q: Recommendation? A: I suggest _The Alchemist_ because it is inspiring.
                    - Venting: A: I hear you, that sounds really rough. Let's take it slow.
                    - List: A: **Focus on rest.** Then **hydrate.**`,
                    maxOutputTokens: 200,
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

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
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm experiencing a brief moment of silence. Let's try again in a second." }]);
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
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Presence</span>
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
                            placeholder="Share your thoughts..." 
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={isLoading || !input.trim()}
                            className="bg-sakura-500 text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaraFriend;
