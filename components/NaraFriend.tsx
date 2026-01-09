
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, MoodEntry, Habit, JournalEntry } from '../types.ts';
import { SparklesIcon, BackIcon } from './icons.tsx';

type Message = { sender: 'user' | 'ai'; text: string; };

const AIMessageBody: React.FC<{ text: string }> = ({ text }) => {
  const blocks = text.split('\n\n');
  return (
    <div className="text-sm space-y-3 leading-relaxed">
      {blocks.map((block, i) => <p key={i} className="whitespace-pre-wrap">{block}</p>)}
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
            setMessages([{ sender: 'ai', text: `Hi ${user?.name || 'there'}! I'm Nara. How are you feeling today?` }]);
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
            
            // Construct context from app state for higher accuracy
            const latestMood = appData.moodHistory[0]?.mood || 'unknown';
            const habitStats = `${appData.habits.filter(h => h.completed).length}/${appData.habits.length}`;
            
            // Format history for the API
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-3-flash-preview',
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: userText }] }
                ],
                config: {
                    systemInstruction: `You are Nara, a world-class wellness companion. 
                    CONTEXT: User is ${user?.name}. Latest mood: ${latestMood}. Habits completed: ${habitStats}.
                    GOALS: 
                    1. Be highly responsive and empathetic.
                    2. Accuracy: Provide wellness advice based on the user's logged data.
                    3. Conciseness: Responses MUST be clear and succinct (max 2-3 sentences). Avoid verbosity.
                    4. Intent: Fulfill the user's intent immediately without filler.`,
                    maxOutputTokens: 250,
                    thinkingConfig: { thinkingBudget: 0 } // Optimization for speed
                }
            });

            // Add an empty AI message to start streaming into
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
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I'm experiencing a bit of lag. Could you try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
                <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-[#FFFBF9] dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 text-pink-500" />
                        </div>
                        <span className="font-bold font-serif text-lg text-gray-800 dark:text-slate-100">Nara</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <BackIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${
                                m.sender === 'user' 
                                ? 'bg-gradient-to-br from-pink-500 to-[#E18AAA] text-white rounded-tr-none' 
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-none border border-gray-200 dark:border-slate-600'
                            }`}>
                                <AIMessageBody text={m.text || (isLoading && i === messages.length - 1 ? '...' : '')} />
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t dark:border-slate-700 flex gap-2 bg-gray-50 dark:bg-slate-900">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSend()} 
                        className="flex-1 p-3 px-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full outline-none focus:ring-2 focus:ring-pink-300 dark:text-slate-100 transition-all"
                        placeholder="Share your thoughts..." 
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend} 
                        disabled={isLoading || !input.trim()}
                        className="bg-[#E18AAA] hover:bg-pink-600 text-white p-3 px-6 rounded-full font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NaraFriend;
