
import React, { useState } from 'react';
import type { Habit, MoodEntry, JournalEntry } from '../types';
import { DeleteIcon, TrophyIcon, AddIcon, ReadingIcon, MoonStarIcon, SparklesIcon, CheckIcon } from './icons.tsx';

interface HabitTrackerScreenProps {
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    onToggleHabit: (id: string) => void;
    moodHistory: MoodEntry[];
    journalEntries: JournalEntry[];
    isIslamicGuidanceOn: boolean;
}

const ISLAMIC_HABIT_TEMPLATES = [
    { name: 'Morning Adhkar', description: 'Recite SubhanAllah, Alhamdulillah, Allahu Akbar (33x each)', icon: '✨' },
    { name: 'Daily Muraja\'ah', description: 'Revise 1 page of a Surah you have memorized', icon: '📖' },
    { name: 'Evening Reflections', description: 'Evaluate your day and make Istighfar (Astaghfirullah)', icon: '🌙' },
    { name: 'Beneficial Knowledge', description: 'Read one Hadith or listen to a 5-min lecture', icon: '💡' }
];

const HabitTrackerScreen: React.FC<HabitTrackerScreenProps> = ({ habits, setHabits, onToggleHabit, isIslamicGuidanceOn }) => {
    const [name, setName] = useState('');
    const [activeGuidanceId, setActiveGuidanceId] = useState<string | null>(null);
    const progress = habits.length ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

    const handleAddHabit = () => {
        if (name.trim()) {
            setHabits([{ id: Date.now().toString(), name, completed: false, streak: 0, color: '#F4ABC4' }, ...habits]);
            setName('');
            if ('vibrate' in navigator) navigator.vibrate(20);
        }
    };

    const seedSpiritualHabits = () => {
        const newHabits = ISLAMIC_HABIT_TEMPLATES
            .filter(template => !habits.find(h => h.name === template.name))
            .map(template => ({
                id: `spiritual-${Date.now()}-${template.name}`,
                name: template.name,
                completed: false,
                streak: 0,
                color: '#10B981', // Emerald for spiritual
                description: template.description
            }));
        setHabits([...newHabits, ...habits]);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Today's Progress Header */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 text-center border border-pink-100 dark:border-slate-700">
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100 mb-3">Today's Progress</h2>
                <p className="text-base font-sans text-gray-500 dark:text-slate-400 mb-6">Nurture your daily rituals to see your garden grow.</p>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-6 p-1 relative overflow-hidden">
                    <div className="bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] h-full rounded-full transition-all duration-1000 shadow-inner" style={{ width: `${progress}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-sans text-pink-900/50 dark:text-pink-100/50 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
                </div>
            </div>

            {/* Quick Actions & Seeding */}
            <div className="flex flex-col gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700/50">
                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-200 mb-6">Add New Habit</h3>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                            placeholder="What's your goal today?" 
                            className="flex-1 p-5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl outline-none text-base font-sans focus:ring-2 focus:ring-[#F4ABC4] transition-all dark:text-slate-200" 
                        />
                        <button onClick={handleAddHabit} className="bg-[#E18AAA] hover:bg-pink-600 text-white p-5 rounded-2xl shadow-lg transition-all active:scale-95"><AddIcon className="w-6 h-6" /></button>
                    </div>
                </div>

                {isIslamicGuidanceOn && (
                    <button 
                        onClick={seedSpiritualHabits}
                        className="group relative overflow-hidden p-6 rounded-[2rem] bg-emerald-600 text-white shadow-lg transition-all active:scale-95 flex items-center justify-between"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <MoonStarIcon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold font-serif text-lg">Seed Spiritual Habits</h4>
                                <p className="text-xs text-emerald-100 opacity-80">Import Sunnah-aligned daily practices</p>
                            </div>
                        </div>
                        <SparklesIcon className="w-8 h-8 text-white/40 relative z-10" />
                    </button>
                )}
            </div>

            {/* Habit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map(habit => {
                    const isSpiritual = habit.id.startsWith('spiritual');
                    const description = (habit as any).description;

                    return (
                        <div key={habit.id} className={`p-8 rounded-[2.5rem] transition-all duration-300 border-2 relative overflow-hidden ${habit.completed ? 'bg-white/60 dark:bg-slate-800/60 border-pink-200 dark:border-pink-900/40 opacity-80' : 'bg-white dark:bg-slate-800 shadow-lg border-transparent'}`}>
                            {isSpiritual && !habit.completed && (
                                <div className="absolute top-0 right-0 p-3">
                                    <button 
                                        onClick={() => setActiveGuidanceId(activeGuidanceId === habit.id ? null : habit.id)}
                                        className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 p-2 rounded-full hover:scale-110 transition-transform"
                                        title="View Guidance"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl shadow-sm ${habit.completed ? 'bg-pink-50 dark:bg-pink-900/20' : (isSpiritual ? 'bg-emerald-50 dark:bg-emerald-900/40' : 'bg-gray-50 dark:bg-slate-700')}`}>
                                    <ReadingIcon className={`w-10 h-10 ${habit.completed ? 'text-[#E18AAA]' : (isSpiritual ? 'text-emerald-500' : 'text-gray-400')}`} />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-full text-xs font-bold font-sans shadow-sm uppercase tracking-widest">
                                    <span>🔥</span>
                                    <span>{habit.streak} DAY</span>
                                </div>
                            </div>

                            <h3 className={`text-2xl font-bold font-serif mb-4 leading-tight ${habit.completed ? 'text-gray-400 line-through decoration-pink-300 decoration-2 dark:text-slate-500' : 'text-gray-800 dark:text-slate-200'}`}>{habit.name}</h3>
                            
                            {activeGuidanceId === habit.id && description && (
                                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-fade-in">
                                    <p className="text-xs font-sans text-emerald-800 dark:text-emerald-200 italic leading-relaxed">
                                        “{description}”
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => onToggleHabit(habit.id)} className={`flex-1 py-4 rounded-xl font-bold font-sans text-sm tracking-widest uppercase transition-all shadow-md active:scale-95 ${habit.completed ? 'bg-gray-100 text-gray-400 dark:bg-slate-700' : 'bg-[#E18AAA] hover:bg-pink-600 text-white'}`}>
                                    {habit.completed ? <CheckIcon className="w-5 h-5 mx-auto" /> : 'COMPLETE'}
                                </button>
                                <button onClick={() => setHabits(habits.filter(h => h.id !== habit.id))} className="p-4 text-gray-300 hover:text-red-500 transition-colors bg-gray-50 dark:bg-slate-700 rounded-xl"><DeleteIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitTrackerScreen;
