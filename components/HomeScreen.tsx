
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MoodEntry, Habit, JournalEntry, Cycle, DayLog, Tab, User, SleepEntry } from '../types.ts';
import { MoodIcon, JournalIcon, HabitIcon, SparklesIcon, SleepTrackerIcon, PeriodIcon, GardenIcon, ShareIcon, CheckIcon, MoonStarIcon, DzikirIcon, DuaIcon, ListenIcon, AddIcon, CalmMoodIcon, HappyMoodIcon, TiredMoodIcon, FrustratedMoodIcon, SadMoodIcon, GratefulMoodIcon, RotateLeftIcon } from './icons.tsx';

const WELLNESS_QUOTES = [
    { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
    { text: "Wellness is a connection of path, progress and presence.", author: "Lalah Delia" },
    { text: "Nurturing yourself is not selfish. It’s essential to your survival.", author: "Renee Peterson Trudeau" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Your heart knows the way. Run in that direction.", author: "Rumi" },
    { text: "Peace is a daily practice, not a destination.", author: "Anonymous" },
    { text: "Inhale the future, exhale the past.", author: "Anonymous" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" }
];

const MoodIconMap: Record<string, React.FC<{ className?: string }>> = {
    'Happy': HappyMoodIcon,
    'Calm': CalmMoodIcon,
    'Tired': TiredMoodIcon,
    'Frustrated': FrustratedMoodIcon,
    'Sad': SadMoodIcon,
    'Grateful': GratefulMoodIcon
};

interface DashboardProps {
    user: User | null;
    moodHistory: MoodEntry[];
    habits: Habit[];
    journalEntries: JournalEntry[];
    cycleData: { cycles: Cycle[], dayLogs: Record<string, DayLog> };
    onNavigate: (tab: Tab) => void;
    gardenXp: number;
    sleepHistory: SleepEntry[];
    isIslamicGuidanceOn?: boolean;
}

const HomeScreen: React.FC<DashboardProps> = ({ user, moodHistory, habits, journalEntries, cycleData, onNavigate, gardenXp, sleepHistory, isIslamicGuidanceOn }) => {
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    
    // State for the motivational quote
    const [currentQuote, setCurrentQuote] = useState(() => {
        const today = new Date();
        return WELLNESS_QUOTES[today.getDate() % WELLNESS_QUOTES.length];
    });
    const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);

    const summary = useMemo(() => {
        const today = new Date();
        
        // Mood
        const latestMood = moodHistory[0]?.mood || 'Not Set';
        
        // Habits
        const completedHabits = habits.filter(h => h.completed).length;
        const habitRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
        
        // Cycle
        const lastCycle = cycleData.cycles[cycleData.cycles.length - 1];
        let cycleInfo = "Track Now";
        if (lastCycle) {
            const start = new Date(lastCycle.startDate + 'T00:00:00');
            const diffDays = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
            cycleInfo = `Day ${diffDays}`;
        }

        // Garden
        const level = Math.floor(gardenXp / 25) + 1;

        return { latestMood, habitRate, cycleInfo, level };
    }, [moodHistory, habits, cycleData, gardenXp]);

    const refreshQuote = useCallback(() => {
        setIsRefreshingQuote(true);
        if ('vibrate' in navigator) navigator.vibrate(10);
        
        setTimeout(() => {
            let nextQuote;
            do {
                nextQuote = WELLNESS_QUOTES[Math.floor(Math.random() * WELLNESS_QUOTES.length)];
            } while (nextQuote.text === currentQuote.text);
            
            setCurrentQuote(nextQuote);
            setIsRefreshingQuote(false);
        }, 300);
    }, [currentQuote]);

    const fetchInsight = async () => {
        if (!user) return;
        setIsInsightLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Greeting for ${user.name} in a Zen, Sakura-themed wellness app. Status: Mood is ${summary.latestMood === 'Not Set' ? 'awaiting log' : summary.latestMood}, ${summary.habitRate}% habits done. Give 1 soulful greeting. Max 12 words.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { maxOutputTokens: 50 }
            });
            if (response.text) setAiInsight(response.text.trim());
        } catch {
            setAiInsight(`Peace blooms within you, ${user.name}.`);
        } finally { setIsInsightLoading(false); }
    };

    useEffect(() => {
        fetchInsight();
    }, [user?.name, summary.latestMood, summary.habitRate, summary.level]);

    return (
        <div className="space-y-8 pb-4 animate-fade-in">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">
                        Sanctuary
                    </h2>
                    <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1 italic">
                        {isInsightLoading ? 'Waiting for the petals to settle...' : aiInsight}
                    </p>
                </div>
            </div>

            {/* Quick Actions Tray */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                <button onClick={() => onNavigate(Tab.Mood)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-orange-100 dark:bg-orange-900/30 rounded-3xl text-orange-700 dark:text-orange-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <MoodIcon className="w-5 h-5" /> Log Mood
                </button>
                <button onClick={() => onNavigate(Tab.Journal)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-sakura-100 dark:bg-sakura-900/30 rounded-3xl text-sakura-700 dark:text-sakura-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <JournalIcon className="w-5 h-5" /> Reflect
                </button>
                <button onClick={() => onNavigate(Tab.Period)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-rose-100 dark:bg-rose-900/30 rounded-3xl text-rose-700 dark:text-rose-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <PeriodIcon className="w-5 h-5" /> Body Log
                </button>
                <button onClick={() => onNavigate(Tab.Habit)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl text-emerald-700 dark:text-emerald-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <HabitIcon className="w-5 h-5" /> Rituals
                </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl text-rose-500"><PeriodIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Cycle</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.cycleInfo}</p>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Current Nature</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-2xl text-orange-500">
                            {MoodIconMap[summary.latestMood] ? React.createElement(MoodIconMap[summary.latestMood], { className: "w-5 h-5" }) : <MoodIcon className="w-5 h-5" />}
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Soul</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.latestMood}</p>
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Today's Vibe</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-500"><HabitIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Ritual</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.habitRate}%</p>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Habits Bloomed</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500"><GardenIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Bloom</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Level {summary.level}</p>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Garden Growth</p>
                    </div>
                </div>
            </div>

            {/* Daily Inspiration Card */}
            <div className="bg-gradient-to-br from-sakura-100 to-indigo-100 dark:from-sakura-950 dark:to-indigo-950 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group border border-white/50 dark:border-slate-700">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/40 dark:bg-slate-700/40 rounded-2xl text-sakura-600 dark:text-sakura-300 shadow-sm">
                             <SparklesIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold font-sans text-sakura-900/50 dark:text-sakura-100/50 uppercase tracking-[0.2em]">Intention</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={refreshQuote}
                            disabled={isRefreshingQuote}
                            className={`p-3 text-sakura-600 dark:text-sakura-300 hover:text-sakura-800 transition-all rounded-xl bg-white/40 hover:bg-white/60 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 shadow-sm active:scale-90 ${isRefreshingQuote ? 'animate-spin' : ''}`}
                            title="Refresh Intention"
                        >
                            <RotateLeftIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                             navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
                             setShowShareToast(true);
                             setTimeout(() => setShowShareToast(false), 2000);
                        }} className="p-3 text-sakura-600 dark:text-sakura-300 hover:text-sakura-800 transition-all rounded-xl bg-white/40 hover:bg-white/60 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 shadow-sm active:scale-90" title="Share">
                            <ShareIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <blockquote className={`space-y-4 relative z-10 transition-all duration-300 ${isRefreshingQuote ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <p className="text-2xl font-serif text-sakura-900 dark:text-sakura-100 italic leading-snug">
                        "{currentQuote.text}"
                    </p>
                    <footer cassName="text-sm font-sans font-bold text-sakura-400 dark:text-sakura-300 uppercase tracking-widest">
                        — {currentQuote.author}
                    </footer>
                </blockquote>
            </div>

            {showShareToast &&(
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-md text-white py-3 px-8 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pop z-50 shadow-2xl flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                    Wisdom copied
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
