
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, MoodEntry, Habit, JournalEntry, Cycle, DayLog } from '../types';
import { SparklesIcon, BackIcon } from './icons';

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

type AppData = {
    moodHistory: MoodEntry[];
    habits: Habit[];
    journalEntries: JournalEntry[];
    cycles: Cycle[];
    dayLogs: Record<string, DayLog>;
};

interface NaraFriendProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    appData: AppData;
    onJournalEntry: (entries: JournalEntry[]) => void;
}

// New component to render AI responses with Markdown formatting
const AIMessageBody: React.FC<{ text: string }> = ({ text }) => {
  const processSegment = (segment: string) => {
    // Process bold text (**text**)
    const parts = segment.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  
  // Split the text into paragraphs (separated by double newlines) or list blocks
  const blocks = text.split('\n\n');
  
  return (
    <div className="text-sm space-y-3 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        // Check if the block is a list (all lines start with '- ')
        if (lines.length > 1 && lines.every(line => line.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="pl-1">{processSegment(line.replace(/^- /, ''))}</li>
              ))}
            </ul>
          );
        }
        // Otherwise, it's a paragraph
        return <p key={i}>{processSegment(block)}</p>;
      })}
    </div>
  );
};


const NaraFriend: React.FC<NaraFriendProps> = ({ isOpen, onClose, user, appData, onJournalEntry }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateDynamicGreeting = (user: User | null, moodHistory: MoodEntry[], habits: Habit[]) => {
        const hour = new Date().getHours();
        const name = user?.name ? `, ${user.name}` : "";
        
        let timeGreeting = "Good morning";
        if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
        else if (hour >= 17) timeGreeting = "Good evening";

        // Check for recent negative mood
        const lastMood = moodHistory.length > 0 ? moodHistory[0] : null;
        const isRecentNegative = lastMood && ['Sad', 'Tired', 'Frustrated'].includes(lastMood.mood) && (new Date().getTime() - new Date(lastMood.date).getTime() < 86400000);

        if (isRecentNegative) {
            return `Hi${name}. I noticed you were feeling a bit ${lastMood?.mood.toLowerCase()} recently. I'm here if you need a listening ear or a gentle distraction.`;
        }

        const templates = [
            `${timeGreeting}${name}! It's a lovely day to be you. What's on your mind?`,
            `Hello${name}. I'm here to support you. Do you want to chat, reflect, or maybe hear a story?`,
            `Hi${name}! I hope your day is treating you gently. How are things going?`,
            `${timeGreeting}. Whether you want to celebrate a win or just vent, I'm all ears.`,
        ];

        return templates[Math.floor(Math.random() * templates.length)];
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = generateDynamicGreeting(user, appData.moodHistory, appData.habits);
            setMessages([{ sender: 'ai', text: greeting }]);
        }
    }, [isOpen]); 

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userText = input;
        const newMessages = [...messages, { sender: 'user' as const, text: userText }];
        setMessages(newMessages); 
        setInput('');
        setIsLoading(true);

        // Simple check for journaling intent
        if (userText.toLowerCase().startsWith('journal:') || (userText.toLowerCase().includes('save this') && userText.length > 20)) {
             const content = userText.replace(/journal:/i, '').replace(/save this/i, '').trim();
             const newEntry: JournalEntry = {
                id: new Date().toISOString(),
                content: content,
                date: new Date(),
                tags: ['from-chat']
            };
            const updatedEntries = [newEntry, ...appData.journalEntries];
            onJournalEntry(updatedEntries);
            setMessages(prev => [...prev, { sender: 'ai', text: "I've carefully saved those thoughts to your journal for you. Writing is such a powerful release. Is there anything else on your mind?" }]);
            setIsLoading(false);
            return;
        }

        try {
            // Prepare Context
            const lastCycle = appData.cycles.length > 0 ? appData.cycles[appData.cycles.length - 1] : null;
            const daysSinceStart = lastCycle ? Math.floor((new Date().getTime() - new Date(lastCycle.startDate).getTime()) / 86400000) + 1 : 0;
            
            const wellnessContext = `
                [USER CONTEXT - USE THIS TO BE PERSONAL BUT DO NOT READ IT OUT LOUD]
                User: ${user?.name || 'Friend'}
                Date: ${new Date().toLocaleDateString()}
                
                WELLNESS SNAPSHOT:
                - Moods (Last 3): ${appData.moodHistory.slice(0, 3).map(m => `${m.mood} (${m.date.toLocaleDateString()})`).join(', ')}
                - Active Habits: ${appData.habits.map(h => `${h.name} (${h.completed ? 'Done' : 'Not done'}, Streak: ${h.streak})`).join(', ')}
                - Cycle Day: ${daysSinceStart > 0 ? daysSinceStart : 'Unknown'}
                - Recent Symptoms: ${(Object.values(appData.dayLogs) as DayLog[]).slice(-2).flatMap(l => l.symptoms).join(', ') || 'None'}
            `;

            // Construct Conversation History for Multi-turn
            // We map 'ai' to 'model' for the API
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            // Create new instance for fresh state/key
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const response = await genAI.models.generateContent({
                model: 'gemini-3-pro-preview', // Using the Pro model for higher quality reasoning and empathy
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: `${wellnessContext}\n\n${userText}` }] }
                ],
                config: {
                    systemInstruction: `You are Nara, the soul of the Anara wellness app. 
                    
                    **YOUR PERSONA:**
                    - You are a warm, wise, and gentle female confidante. Think of a supportive older sister or a kind friend.
                    - You care deeply about the user's emotional and physical well-being.
                    - Your tone is soothing, encouraging, and non-judgmental.
                    - You occasionally use metaphors from nature (gardens, blooming, seasons, tides, roots) to explain growth and healing.
                    
                    **YOUR MISSION:**
                    - **Support:** Validate feelings first. If they are sad, be comforting. If happy, celebrate with them!
                    - **Guide:** Use the provided wellness context. If they are in their Luteal phase (Cycle Day 20-28), be gentle about energy levels. If they broke a habit streak, remind them that rest is part of growth.
                    - **Engage:** Ask thoughtful follow-up questions to help them reflect, but don't interrogate.
                    
                    **FORMATTING RULES:**
                    - Use **bold** for key affirming words or action items.
                    - Use bullet points for lists of tips.
                    - Keep responses concise (under 100 words) unless telling a story or explaining a complex topic.
                    - Never start with "As an AI...". You are Nara.
                    
                    **SAFETY:**
                    - You are a wellness companion, not a doctor. For serious medical or mental health crises, gently suggest seeking professional help.`,
                }
            });

            const aiText = response.text || "I'm listening, and I'm here for you.";
            const aiMessage: Message = { sender: 'ai', text: aiText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error with Gemini API:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm feeling a little disconnected right now. Could you say that again?" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center animate-fade-in p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden ring-1 ring-white/20">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 border-b border-pink-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                         <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm">
                             <SparklesIcon className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                         </div>
                         <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-slate-100 font-serif">Nara</h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                Online & Listening
                            </p>
                         </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close chat"
                    >
                        <BackIcon className="w-6 h-6 text-gray-500 dark:text-slate-400" />
                    </button>
                </header>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-[#FFFBF9] dark:bg-slate-900">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold self-end mb-1">
                                    N
                                </div>
                            )}
                            <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm text-sm ${
                                msg.sender === 'user' 
                                ? 'bg-[#E18AAA] text-white rounded-br-sm' 
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-bl-sm border border-pink-50 dark:border-slate-700'
                            }`}>
                                {msg.sender === 'ai' ? <AIMessageBody text={msg.text} /> : <p className="leading-relaxed">{msg.text}</p>}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold self-end mb-1">N</div>
                             <div className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 rounded-bl-sm shadow-sm border border-pink-50 dark:border-slate-700">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <footer className="p-4 bg-white dark:bg-slate-800 border-t border-pink-50 dark:border-slate-700">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Type a message..."
                            className="w-full pl-5 pr-14 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-[#F4ABC4] focus:border-transparent outline-none transition-all dark:text-slate-200 placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={isLoading || !input.trim()} 
                            className="absolute right-2 p-2 bg-[#E18AAA] text-white rounded-full hover:bg-pink-600 disabled:bg-gray-300 disabled:dark:bg-slate-700 transition-colors shadow-md"
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 mt-2">
                        Nara offers support, not medical advice.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default NaraFriend;
