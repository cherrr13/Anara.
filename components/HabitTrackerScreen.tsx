import React, { useState } from 'react';
import type { Habit } from '../types';
import { DeleteIcon, CheckIcon, ReadingIcon, ExerciseIcon, MeditationIcon, CreativeIcon, WorkIcon, WaterDropIcon, BedIcon, AppleIcon, SparklesIcon, BrainIcon, TrophyIcon } from './icons';

// Define the available icons and their corresponding components
const habitIcons: { [key: string]: React.FC<{className?: string}> } = {
    Reading: ReadingIcon,
    Exercise: ExerciseIcon,
    Meditation: MeditationIcon,
    Water: WaterDropIcon,
    Sleep: BedIcon,
    Eating: AppleIcon,
    Cleaning: SparklesIcon,
    Study: BrainIcon,
    Creative: CreativeIcon,
    Work: WorkIcon
};
const iconNames = Object.keys(habitIcons);

// Define a palette of colors for habits
const habitColors = [
    '#F87171', // red
    '#FB923C', // orange
    '#FBBF24', // amber
    '#4ADE80', // green
    '#2DD4BF', // teal
    '#60A5FA', // blue
    '#818CF8', // indigo
    '#C084FC', // purple
    '#F472B6', // pink
];

interface HabitTrackerScreenProps {
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    onToggleHabit: (id: string) => void;
}

const IconPicker: React.FC<{ selected: string, onSelect: (name: string) => void }> = ({ selected, onSelect }) => (
    <div className="bg-gray-50 dark:bg-slate-700/30 rounded-2xl p-5 border border-gray-100 dark:border-slate-600/50">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
            {iconNames.map(iconName => {
                const Icon = habitIcons[iconName];
                const isSelected = selected === iconName;
                return (
                    <button
                        type="button"
                        key={iconName}
                        onClick={() => onSelect(iconName)}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 aspect-square ${isSelected ? 'bg-white dark:bg-slate-600 text-pink-500 shadow-lg scale-110 ring-2 ring-pink-400 z-10' : 'bg-white/50 dark:bg-slate-800/50 text-gray-400 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200 hover:shadow-md hover:scale-105'}`}
                        title={iconName}
                        aria-label={`Select icon ${iconName}`}
                        aria-pressed={isSelected}
                    >
                        <Icon className={`w-6 h-6 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                        {isSelected && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 rounded-full border-2 border-white dark:border-slate-700 flex items-center justify-center"><CheckIcon className="w-2.5 h-2.5 text-white" /></div>}
                    </button>
                );
            })}
        </div>
    </div>
);

const HabitCard: React.FC<{ habit: Habit, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ habit, onToggle, onDelete }) => {
    const Icon = habit.icon ? habitIcons[habit.icon] : ReadingIcon;
    const color = habit.color || '#F4ABC4';
    const currentStreak = habit.streak || 0;
    const streakGoal = habit.streakGoal;
    const goalReached = streakGoal ? currentStreak >= streakGoal : false;
    const progressPercent = streakGoal ? Math.min((currentStreak / streakGoal) * 100, 100) : 0;

    return (
        <div 
            className={`relative flex flex-col p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl group ${habit.completed ? 'bg-white/80 dark:bg-slate-800/80 border-2 border-pink-100 dark:border-slate-700' : 'bg-white dark:bg-slate-800 shadow-xl border-2 border-transparent'}`}
        >
             {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-2xl shadow-inner transition-colors ${habit.completed ? 'bg-gray-100 dark:bg-slate-700' : ''}`} style={{ backgroundColor: habit.completed ? undefined : `${color}20` }}>
                    <Icon className={`w-8 h-8 ${habit.completed ? 'text-gray-400 dark:text-slate-500' : ''}`} style={{ color: habit.completed ? undefined : color }} />
                </div>
                
                <div className="flex items-center gap-2">
                     <div className={`flex items-center gap-1 px-4 py-2 rounded-full shadow-sm ${habit.completed ? 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500' : 'bg-orange-50 text-orange-500 dark:bg-orange-900/20'}`}>
                        <span className="text-xl">🔥</span>
                        <span className="font-bold text-base">{currentStreak}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mb-6 flex-grow">
                <h3 
                    className={`font-bold text-2xl mb-2 ${habit.completed ? 'text-gray-400 dark:text-slate-500 line-through decoration-2 decoration-pink-300' : 'text-gray-800 dark:text-slate-200'}`}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {habit.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                    {habit.completed ? 'Completed for today' : 'Not completed yet'}
                </p>
            </div>

            {/* Progress Bar (if goal exists) */}
            {streakGoal && (
                <div className="mb-6 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
                    <div className="flex justify-between text-xs mb-2 font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            {goalReached ? (
                                <span className="text-green-500 flex items-center gap-1"><TrophyIcon className="w-4 h-4" /> Goal Met!</span>
                            ) : (
                                <span>Goal Progress</span>
                            )}
                        </span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden shadow-inner">
                         <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ 
                                width: `${progressPercent}%`, 
                                backgroundColor: goalReached ? '#4ADE80' : color,
                                backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                                backgroundSize: '1rem 1rem'
                            }} 
                        >
                        </div>
                    </div>
                    <div className="text-right mt-2 text-xs text-gray-400 dark:text-slate-500 font-mono font-semibold">
                        {currentStreak} / {streakGoal} days
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto">
                <button
                    onClick={() => onToggle(habit.id)}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md ${
                        habit.completed 
                        ? 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600' 
                        : 'bg-gray-900 text-white dark:bg-white dark:text-slate-900 hover:shadow-lg hover:bg-gray-800 dark:hover:bg-slate-100'
                    }`}
                >
                    {habit.completed ? 'Undo' : 'Mark Complete'}
                    {habit.completed && <CheckIcon className="w-4 h-4" />}
                </button>
                 <button 
                    onClick={() => onDelete(habit.id)}
                    className="p-3.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    aria-label="Delete habit"
                >
                    <DeleteIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const HabitTrackerScreen: React.FC<HabitTrackerScreenProps> = ({ habits, setHabits, onToggleHabit }) => {
    const [newHabit, setNewHabit] = useState('');
    const [newHabitGoal, setNewHabitGoal] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(iconNames[0]);
    const [selectedColor, setSelectedColor] = useState(habitColors[0]);

    const addHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabit.trim()) {
            const newHabitObject: Habit = {
                id: new Date().toISOString(),
                name: newHabit,
                completed: false,
                streak: 0,
                streakGoal: newHabitGoal ? parseInt(newHabitGoal, 10) : undefined,
                icon: selectedIcon,
                color: selectedColor,
            };
            setHabits([...habits, newHabitObject]);
            setNewHabit('');
            setNewHabitGoal('');
            setSelectedIcon(iconNames[0]);
            setSelectedColor(habitColors[0]);
        }
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(habit => habit.id !== id));
    };
    
    const progress = habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            {/* Header Section with Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-8 text-center relative overflow-hidden group border border-pink-100 dark:border-slate-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-1000 opacity-60"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-1000 opacity-60"></div>
                
                <div className="relative z-10">
                    <h2 className="text-5xl font-bold text-[#4B4246] dark:text-slate-100 mb-3 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Today's Goals</h2>
                    <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium text-lg">"Consistency is key to progress."</p>
                    
                    <div className="max-w-2xl mx-auto relative">
                        <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
                            <span>Start</span>
                            <span className="text-pink-500 dark:text-pink-400">{Math.round(progress)}% Complete</span>
                            <span>Finish</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-6 shadow-inner p-1">
                            <div 
                                className="bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] h-full rounded-full transition-all duration-1000 ease-out shadow-md relative" 
                                style={{ width: `${progress}%` }}
                            >
                                {progress > 0 && (
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
            {/* Create Habit Form */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50 dark:to-slate-700/20 rounded-bl-[4rem]"></div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-8 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>Add New Habit</h3>
                <form onSubmit={addHabit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="font-bold text-gray-700 dark:text-slate-300 mb-3 block text-sm uppercase tracking-wide">Habit Name</label>
                            <input
                                type="text"
                                value={newHabit}
                                onChange={(e) => setNewHabit(e.target.value)}
                                placeholder="e.g., Morning Meditation"
                                className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#F4ABC4]/30 focus:border-[#F4ABC4] transition dark:text-slate-200 placeholder-gray-400 text-lg shadow-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-gray-700 dark:text-slate-300 mb-3 block text-sm uppercase tracking-wide">Streak Goal <span className="font-normal text-gray-400 text-xs normal-case ml-1">(days)</span></label>
                            <input
                                type="number"
                                value={newHabitGoal}
                                onChange={(e) => setNewHabitGoal(e.target.value)}
                                placeholder="e.g., 30"
                                min="1"
                                className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#F4ABC4]/30 focus:border-[#F4ABC4] transition dark:text-slate-200 placeholder-gray-400 text-lg shadow-sm outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-bold text-gray-700 dark:text-slate-300 mb-4 block text-sm uppercase tracking-wide">Select Icon</label>
                        <IconPicker selected={selectedIcon} onSelect={setSelectedIcon} />
                    </div>

                    <div>
                        <label className="font-bold text-gray-700 dark:text-slate-300 mb-4 block text-sm uppercase tracking-wide">Select Color</label>
                        <div className="flex flex-wrap gap-5">
                            {habitColors.map(color => (
                                <button
                                    type="button"
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-12 h-12 rounded-full transition-transform duration-300 shadow-md ${selectedColor === color ? 'scale-125 ring-4 ring-gray-200 dark:ring-slate-500' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#E18AAA] text-white font-bold py-5 px-6 rounded-2xl hover:bg-pink-600 transition shadow-xl hover:shadow-2xl active:scale-[0.98] transform flex items-center justify-center gap-3 text-lg">
                        <CheckIcon className="w-6 h-6" /> Create New Habit
                    </button>
                </form>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {habits.map((habit, index) => (
                    <div key={habit.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-list-item">
                        <HabitCard 
                            habit={habit} 
                            onToggle={onToggleHabit} 
                            onDelete={deleteHabit} 
                        />
                    </div>
                ))}
            </div>

            {habits.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[2rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-pink-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce">✨</div>
                    <h3 className="text-2xl font-bold text-gray-600 dark:text-slate-300 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Your journey begins here</h3>
                    <p className="text-gray-400 dark:text-slate-500 font-medium text-lg max-w-md mx-auto">Create your first habit above to start building your streak and tracking your progress.</p>
                </div>
            )}
        </div>
    );
};

export default HabitTrackerScreen;