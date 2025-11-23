
import React, { useMemo, useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MoodEntry, Habit, JournalEntry, Cycle, DayLog, Tab, User } from '../types';
import { MoodIcon, JournalIcon, HabitIcon, SparklesIcon } from './icons';

// --- DATA COLLECTIONS ---
const QUOTES = [
    "It's not whether you get knocked down, it's whether you get up.",
    "The secret of getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "Happiness is not by chance, but by choice.",
    "Turn your wounds into wisdom.",
    "Every day may not be good, but there is something good in every day.",
    "You are enough just as you are.",
    "Breathe. You’ve got this.",
    "Small steps in the right direction can turn out to be the biggest step of your life.",
    "Be gentle with yourself. You're doing the best you can."
];

const REMINDERS = [
    "Unclench your jaw and drop your shoulders.",
    "Drink a glass of water right now.",
    "Take three deep breaths.",
    "Step outside for a minute of fresh air.",
    "Be kind to yourself today.",
    "It’s okay to take a break.",
    "Listen to your body.",
    "Celebrate your small wins.",
    "Disconnect to reconnect.",
    "You don't have to do it all today."
];

const INSIGHTS = [
    "Did you know? Even 10 minutes of walking can boost your mood significantly.",
    "Sleep is when your brain processes emotions. Prioritize rest for mental clarity.",
    "Journaling for 5 minutes can reduce stress and increase self-awareness.",
    "Dehydration often masquerades as fatigue. Hydrate before you caffeinate.",
    "Spending time in nature lowers cortisol levels and reduces stress.",
    "Gratitude physically changes your brain structure to be more resilient.",
    "Social connection is as important to long-term health as exercise.",
    "Consistency beats intensity when building new habits.",
    "Blue light from screens can disrupt your circadian rhythm. Try dimming them at night.",
    "Deep belly breathing triggers your parasympathetic nervous system to calm you down."
];

// --- CARD COMPONENTS ---
const StatCard: React.FC<{ value: string | number, label: string, color: string }> = ({ value, label, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 flex-1 text-center">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">{label}</p>
    </div>
);

const QuickActionCard: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 flex-1 text-left hover:shadow-xl transition-shadow w-full">
        <div className="text-[#E18AAA] dark:text-pink-400 mb-2">{icon}</div>
        <h4 className="font-bold text-gray-800 dark:text-slate-100">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
    </button>
);


// --- CHART COMPONENTS ---
const MoodDonutChart: React.FC<{ data: MoodEntry[] }> = ({ data }) => {
    const moodCounts = useMemo(() => {
        return data.reduce((acc, entry) => {
            const mood = entry.mood;
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [data]);

    const moodColors: Record<MoodEntry['mood'], string> = { Happy: '#FBBF24', Calm: '#A7D7C5', Sad: '#93C5FD', Tired: '#C4B5FD', Frustrated: '#FB923C', Grateful: '#F4ABC4' };
    const total = data.length;
    if (total === 0) return <div className="text-center text-gray-500 dark:text-slate-400 py-8">Log a mood to see your distribution.</div>;
    
    let cumulativePercent = 0;
    const segments = Object.entries(moodCounts).map(([mood, count]) => {
        const percent = (Number(count) / total) * 100;
        const offset = cumulativePercent;
        cumulativePercent += percent;
        return {
            percent,
            offset,
            color: moodColors[mood as MoodEntry['mood']],
            mood,
            count
        };
    });

    return (
        <div className="flex flex-col items-center">
            <svg width="150" height="150" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e6e6e6" strokeWidth="3" className="dark:stroke-slate-700" />
                {segments.map(segment => (
                    <circle key={segment.mood} cx="18" cy="18" r="15.915" fill="none" stroke={segment.color} strokeWidth="3"
                        strokeDasharray={`${segment.percent}, 100`}
                        strokeDashoffset={-segment.offset}
                    />
                ))}
            </svg>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
                {segments.map(s => (
                    <div key={s.mood} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }}></span>
                        <span className="dark:text-slate-300">{s.mood}: {s.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HabitStreakChart: React.FC<{ habits: Habit[] }> = ({ habits }) => {
    const maxStreak = Math.max(...habits.map(h => h.streak || 0), 1);
     if (habits.length === 0) return <div className="text-center text-gray-500 dark:text-slate-400 py-8">Add habits to see your streaks.</div>;

    return (
        <div className="flex justify-around items-end h-40 gap-4 px-2">
            {habits.map(habit => (
                <div key={habit.id} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg" style={{ height: `${((habit.streak || 0) / maxStreak) * 100}%`, backgroundColor: habit.color ? habit.color + 'BF' : '' }}></div>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 truncate">{habit.name}</p>
                </div>
            ))}
        </div>
    );
}

const gardenLevels = [
    { level: 1, name: 'Seedling', xpRequired: 0 },
    { level: 2, name: 'Sprout', xpRequired: 10 },
    { level: 3, name: 'Flower Bud', xpRequired: 30 },
    { level: 4, name: 'Blooming', xpRequired: 60 },
    { level: 5, name: 'Sunflower', xpRequired: 100 },
];

// --- MAIN DASHBOARD COMPONENT ---
interface DashboardProps {
    user: User | null;
    moodHistory: MoodEntry[];
    habits: Habit[];
    journalEntries: JournalEntry[];
    cycleData: { cycles: Cycle[], dayLogs: Record<string, DayLog> };
    onNavigate: (tab: Tab) => void;
    gardenXp: number;
}

const HomeScreen: React.FC<DashboardProps> = ({ user, moodHistory, habits, journalEntries, cycleData, onNavigate, gardenXp }) => {
    
    // --- STATE FOR AI INSIGHT ---
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);

    // --- DERIVED DATA & RANDOMIZATION ---
    // Using useMemo with empty dependency array ensures these are selected on mount/refresh
    const dailyContent = useMemo(() => {
        return {
            quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
            reminder: REMINDERS[Math.floor(Math.random() * REMINDERS.length)],
            insight: INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]
        };
    }, []);

    const habitsCompletedToday = habits.filter(h => h.completed).length;

    const gardenLevel = useMemo(() => {
        return [...gardenLevels].reverse().find(l => gardenXp >= l.xpRequired)?.level || 1;
    }, [gardenXp]);
    
    const { cycleDay, cyclePhase } = useMemo(() => {
        if (!cycleData.cycles.length) return { cycleDay: 'N/A', cyclePhase: 'No data' };
        const lastCycle = cycleData.cycles[cycleData.cycles.length - 1];
        const dayDiff = Math.floor((new Date().getTime() - new Date(lastCycle.startDate).getTime()) / 86400000) + 1;
        if (dayDiff <= 5) return { cycleDay: dayDiff, cyclePhase: 'Menstruation' };
        if (dayDiff <= 14) return { cycleDay: dayDiff, cyclePhase: 'Follicular' };
        if (dayDiff <= 28) return { cycleDay: dayDiff, cyclePhase: 'Luteal' };
        return { cycleDay: dayDiff, cyclePhase: 'Follicular' };
    }, [cycleData]);

    // --- AI INSIGHT GENERATION ---
    const generateWellnessInsight = async () => {
        setIsInsightLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Construct context
            const recentMoods = moodHistory.slice(0, 3).map(m => m.mood).join(', ') || 'No moods logged recently';
            const habitStatus = `${habitsCompletedToday} out of ${habits.length} habits completed today`;
            
            const prompt = `
                You are a supportive wellness coach named Nara.
                Generate a single, warm, personalized, and specific 2-sentence wellness insight based on this user data:
                - User Name: ${user?.name || 'Friend'}
                - Recent Moods: ${recentMoods}
                - Cycle Phase: ${cyclePhase} (Day ${cycleDay})
                - Habit Progress: ${habitStatus}
                
                If the data suggests low energy (e.g., Luteal/Menstrual phase, sad mood, low habits), be gentle and suggest rest.
                If the data suggests high energy, be encouraging.
                Do not start with "Based on your data". Just speak naturally.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            if (response.text) {
                setAiInsight(response.text.trim());
            }
        } catch (error) {
            console.error("Failed to generate insight", error);
            setAiInsight("Remember to listen to your body and take things one step at a time today.");
        } finally {
            setIsInsightLoading(false);
        }
    };

    // Generate insight on mount
    useEffect(() => {
        generateWellnessInsight();
    }, []);

    const welcomeMessage = user?.isNewUser ? "Welcome" : "Welcome back";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {welcomeMessage}, {user?.name}!
                </h2>
                <p className="text-[#8D7F85] dark:text-slate-400 italic mt-1">"{dailyContent.quote}"</p>
            </div>

            {/* AI Wellness Insight Section */}
            <div className="bg-gradient-to-r from-[#E0D9FE] to-[#FCE7F3] dark:from-indigo-900/50 dark:to-pink-900/50 rounded-2xl shadow-lg p-6 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider text-xs">Nara's Daily Insight</h3>
                    </div>
                    <button 
                        onClick={generateWellnessInsight} 
                        disabled={isInsightLoading}
                        className="text-xs bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300 font-semibold transition-all disabled:opacity-50"
                    >
                        {isInsightLoading ? 'Thinking...' : 'Refresh'}
                    </button>
                </div>
                
                <div className="relative z-10 min-h-[3rem] flex items-center">
                    {isInsightLoading ? (
                         <div className="flex items-center space-x-2 animate-pulse">
                            <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                        </div>
                    ) : (
                        <p className="text-lg font-medium text-gray-800 dark:text-slate-100 leading-relaxed">
                            "{aiInsight}"
                        </p>
                    )}
                </div>
                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* For You Section (Dynamic Content) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200 mb-4">For You Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#FCE7F3] dark:bg-pink-900/40 p-4 rounded-xl border border-pink-100 dark:border-pink-800/50">
                        <p className="text-sm font-semibold text-pink-800 dark:text-pink-300 uppercase tracking-wide mb-1">Daily Reminder</p>
                        <p className="text-pink-700 dark:text-pink-200 text-lg font-medium">"{dailyContent.reminder}"</p>
                    </div>
                    <div className="bg-[#E0D9FE] dark:bg-indigo-900/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide mb-1">Wellness Insight</p>
                        <p className="text-indigo-700 dark:text-indigo-200">{dailyContent.insight}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard value={cycleDay} label="Cycle Day" color="text-[#F472B6]" />
                <StatCard value={`${habitsCompletedToday}/${habits.length}`} label="Habits Done" color="text-[#818CF8]" />
                <StatCard value={moodHistory.length} label="Moods Logged" color="text-[#FBBF24]" />
                <StatCard value={gardenLevel} label="Garden Level" color="text-[#4ADE80]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200 mb-4">Mood Distribution</h3>
                    <MoodDonutChart data={moodHistory.slice(0, 30)} />
                </div>
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200 mb-4">Habit Streaks</h3>
                    <HabitStreakChart habits={habits} />
                </div>
            </div>
            
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">Quick Actions</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <QuickActionCard icon={<MoodIcon className="w-8 h-8"/>} title="Log a Mood" subtitle="Check in with yourself" onClick={() => onNavigate(Tab.Mood)} />
                     <QuickActionCard icon={<HabitIcon className="w-8 h-8"/>} title="Update Habits" subtitle="Review today's goals" onClick={() => onNavigate(Tab.Habit)} />
                     <QuickActionCard icon={<JournalIcon className="w-8 h-8"/>} title="Write in Journal" subtitle="Reflect on your day" onClick={() => onNavigate(Tab.Journal)} />
                </div>
            </div>

        </div>
    );
};

export default HomeScreen;
