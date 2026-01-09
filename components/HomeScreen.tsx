
import React, { useMemo, useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MoodEntry, Habit, JournalEntry, Cycle, DayLog, Tab, User, SleepEntry } from '../types.ts';
import { MoodIcon, JournalIcon, HabitIcon, SparklesIcon, SleepTrackerIcon, PeriodIcon, GardenIcon, ShareIcon, CheckIcon, MoonStarIcon, DzikirIcon, DuaIcon, ListenIcon, AddIcon, MenuGridIcon, CalmMoodIcon, HappyMoodIcon, TiredMoodIcon, FrustratedMoodIcon, SadMoodIcon, GratefulMoodIcon } from './icons.tsx';

const WELLNESS_QUOTES = [
    { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
    { text: "Wellness is a connection of path, progress and presence.", author: "Lalah Delia" },
    { text: "Nurturing yourself is not selfish. It’s essential to your survival.", author: "Renee Peterson Trudeau" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Your heart knows the way. Run in that direction.", author: "Rumi" },
    { text: "Peace is a daily practice, not a destination.", author: "Anonymous" }
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

    const summary = useMemo(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
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

        return { latestMood, habitRate, cycleInfo, level, quote: WELLNESS_QUOTES[today.getDate() % WELLNESS_QUOTES.length] };
    }, [moodHistory, habits, cycleData, gardenXp]);

    const fetchInsight = async () => {
        if (!user) return;
        setIsInsightLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Greeting for ${user.name}. Status: Mood is ${summary.latestMood}, ${summary.habitRate}% habits done. Give 1 soulful greeting. Max 15 words.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { maxOutputTokens: 50 }
            });
            if (response.text) setAiInsight(response.text.trim());
        } catch {
            setAiInsight(`A beautiful day for a beautiful soul. Let's bloom, ${user.name}.`);
        } finally { setIsInsightLoading(false); }
    };

    useEffect(() => {
        fetchInsight();
    }, [user?.name, summary.latestMood, summary.habitRate]);

    return (
        <div className="space-y-8 pb-4 animate-fade-in">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">
                        Sanctuary
                    </h2>
                    <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1 italic">
                        {isInsightLoading ? 'Brewing your briefing...' : aiInsight}
                    </p>
                </div>
            </div>

            {/* Quick Actions Tray */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                <button onClick={() => onNavigate(Tab.Mood)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-orange-100 dark:bg-orange-900/30 rounded-3xl text-orange-700 dark:text-orange-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <MoodIcon className="w-5 h-5" /> Log Mood
                </button>
                <button onClick={() => onNavigate(Tab.Journal)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-pink-100 dark:bg-pink-900/30 rounded-3xl text-pink-700 dark:text-pink-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <JournalIcon className="w-5 h-5" /> New Memory
                </button>
                <button onClick={() => onNavigate(Tab.Period)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-rose-100 dark:bg-rose-900/30 rounded-3xl text-rose-700 dark:text-rose-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <PeriodIcon className="w-5 h-5" /> Body Log
                </button>
                <button onClick={() => onNavigate(Tab.Habit)} className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl text-emerald-700 dark:text-emerald-200 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">
                    <HabitIcon className="w-5 h-5" /> Habits
                </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl text-rose-500"><PeriodIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Rest</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.cycleInfo}</p>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Current Cycle</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-2xl text-orange-500">
                            {MoodIconMap[summary.latestMood] ? React.createElement(MoodIconMap[summary.latestMood], { className: "w-5 h-5" }) : <MoodIcon className="w-5 h-5" />}
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Spirit</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.latestMood}</p>
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Daily Vibration</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-500"><HabitIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Growth</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">{summary.habitRate}%</p>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Rituals Done</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500"><GardenIcon className="w-5 h-5" /></div>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Bloom</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Level {summary.level}</p>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{gardenXp} Total XP</p>
                    </div>
                </div>
            </div>

            {/* Daily Inspiration Card */}
            <div className="bg-gradient-to-br from-[#E0D9FE] to-[#FCE7F3] dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="p-3 bg-white/40 dark:bg-slate-700/40 rounded-2xl text-purple-600 dark:text-purple-300">
                         <SparklesIcon className="w-6 h-6" />
                    </div>
                    <button onClick={() => {
                         navigator.clipboard.writeText(`"${summary.quote.text}" — ${summary.quote.author}`);
                         setShowShareToast(true);
                         setTimeout(() => setShowShareToast(false), 2000);
                    }} className="p-3 text-purple-400 hover:text-purple-600 transition-colors rounded-xl bg-white/20">
                        <ShareIcon className="w-5 h-5" />
                    </button>
                </div>
                <blockquote className="space-y-4 relative z-10">
                    <p className="text-2xl font-serif text-purple-900 dark:text-purple-100 italic leading-snug">
                        "{summary.quote.text}"
                    </p>
                    <footer className="text-sm font-sans font-bold text-purple-400 dark:text-purple-300 uppercase tracking-widest">
                        — {summary.quote.author}
                    </footer>
                </blockquote>
            </div>

            {showShareToast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 px-6 rounded-full text-xs font-bold animate-pop z-50">
                    Inspiration copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
