
import React, { useState } from 'react';
import type { Habit, MoodEntry, JournalEntry } from '../types';
import { 
    DeleteIcon, TrophyIcon, AddIcon, ReadingIcon, MoonStarIcon, SparklesIcon, CheckIcon, StarIcon,
    WaterDropIcon, BedIcon, AppleIcon, BrainIcon, WalkingIcon, DumbbellIcon, YogaIcon, CoffeeIcon,
    TeaIcon, VeggieIcon, FruitBowlIcon, ClockIcon, CalendarIcon, BrushIcon, MusicIcon, CodeIcon,
    BagIcon, HomeIcon, CatIcon, PhoneIcon, DzikirIcon, MurajaahIcon, DuaIcon, ListenIcon, GentleExerciseIcon,
    XMarkIcon, FlameIcon
} from './icons.tsx';

interface HabitTrackerScreenProps {
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    onToggleHabit: (id: string) => void;
    moodHistory: MoodEntry[];
    journalEntries: JournalEntry[];
    isIslamicGuidanceOn: boolean;
}

const ISLAMIC_HABIT_TEMPLATES = [
    { name: 'Morning Adhkar', description: 'Recite SubhanAllah, Alhamdulillah, Allahu Akbar (33x each)', icon: 'DzikirIcon', color: '#10B981' },
    { name: 'Daily Muraja\'ah', description: 'Revise 1 page of a Surah you have memorized', icon: 'MurajaahIcon', color: '#10B981' },
    { name: 'Evening Reflections', description: 'Evaluate your day and make Istighfar (Astaghfirullah)', icon: 'MoonStarIcon', color: '#10B981' },
    { name: 'Beneficial Knowledge', description: 'Read one Hadith or listen to a 5-min lecture', icon: 'ListenIcon', color: '#10B981' }
];

const HABIT_COLORS = [
    { name: 'Anara Pink', value: '#E18AAA' },
    { name: 'Lavender', value: '#A78BFA' },
    { name: 'Soft Blue', value: '#60A5FA' },
    { name: 'Teal', value: '#2DD4BF' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Rose', value: '#FB7185' },
    { name: 'Indigo', value: '#6366F1' },
];

const HABIT_ICONS = {
    Body: [
        { id: 'WaterDropIcon', Icon: WaterDropIcon },
        { id: 'AppleIcon', Icon: AppleIcon },
        { id: 'ExerciseIcon', Icon: GentleExerciseIcon },
        { id: 'WalkingIcon', Icon: WalkingIcon },
        { id: 'DumbbellIcon', Icon: DumbbellIcon },
        { id: 'YogaIcon', Icon: YogaIcon },
        { id: 'VeggieIcon', Icon: VeggieIcon },
        { id: 'FruitBowlIcon', Icon: FruitBowlIcon },
    ],
    Mind: [
        { id: 'ReadingIcon', Icon: ReadingIcon },
        { id: 'BrainIcon', Icon: BrainIcon },
        { id: 'ClockIcon', Icon: ClockIcon },
        { id: 'CalendarIcon', Icon: CalendarIcon },
        { id: 'BrushIcon', Icon: BrushIcon },
        { id: 'MusicIcon', Icon: MusicIcon },
        { id: 'CodeIcon', Icon: CodeIcon },
        { id: 'SparklesIcon', Icon: SparklesIcon },
    ],
    Daily: [
        { id: 'BedIcon', Icon: BedIcon },
        { id: 'CoffeeIcon', Icon: CoffeeIcon },
        { id: 'TeaIcon', Icon: TeaIcon },
        { id: 'BagIcon', Icon: BagIcon },
        { id: 'HomeIcon', Icon: HomeIcon },
        { id: 'CatIcon', Icon: CatIcon },
        { id: 'PhoneIcon', Icon: PhoneIcon },
        { id: 'StarIcon', Icon: StarIcon },
    ],
    Spirit: [
        { id: 'DzikirIcon', Icon: DzikirIcon },
        { id: 'MurajaahIcon', Icon: MurajaahIcon },
        { id: 'DuaIcon', Icon: DuaIcon },
        { id: 'ListenIcon', Icon: ListenIcon },
        { id: 'MoonStarIcon', Icon: MoonStarIcon },
    ]
};

const IconMap: Record<string, React.FC<{ className?: string }>> = {
    WaterDropIcon, BedIcon, AppleIcon, BrainIcon, WalkingIcon, DumbbellIcon, YogaIcon, CoffeeIcon,
    TeaIcon, VeggieIcon, FruitBowlIcon, ClockIcon, CalendarIcon, BrushIcon, MusicIcon, CodeIcon,
    BagIcon, HomeIcon, CatIcon, PhoneIcon, DzikirIcon, MurajaahIcon, DuaIcon, ListenIcon, GentleExerciseIcon,
    StarIcon, ReadingIcon, SparklesIcon, MoonStarIcon
};

const HabitTrackerScreen: React.FC<HabitTrackerScreenProps> = ({ habits, setHabits, onToggleHabit, isIslamicGuidanceOn }) => {
    const [name, setName] = useState('');
    const [selectedIconId, setSelectedIconId] = useState('StarIcon');
    const [selectedColor, setSelectedColor] = useState('#E18AAA');
    const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
    const [activeGuidanceId, setActiveGuidanceId] = useState<string | null>(null);
    const [confirmingHabitId, setConfirmingHabitId] = useState<string | null>(null);
    
    const progress = habits.length ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

    const handleAddHabit = () => {
        if (name.trim()) {
            setHabits([{ 
                id: Date.now().toString(), 
                name, 
                completed: false, 
                streak: 0, 
                color: selectedColor, 
                icon: selectedIconId 
            }, ...habits]);
            setName('');
            setSelectedIconId('StarIcon');
            setSelectedColor('#E18AAA');
            setIsPersonalizerOpen(false);
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
                color: template.color,
                icon: template.icon,
                description: template.description
            }));
        setHabits([...newHabits, ...habits]);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    const initiateToggle = (habit: Habit) => {
        if (!habit.completed) {
            setConfirmingHabitId(habit.id);
        } else {
            onToggleHabit(habit.id);
        }
    };

    const confirmCompletion = () => {
        if (confirmingHabitId) {
            onToggleHabit(confirmingHabitId);
            setConfirmingHabitId(null);
        }
    };

    const SelectedIconComp = IconMap[selectedIconId] || StarIcon;
    const confirmingHabit = habits.find(h => h.id === confirmingHabitId);

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Confirmation Dialog */}
            {confirmingHabit && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-pop border border-pink-50 dark:border-slate-700">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div 
                                className="p-5 rounded-[2rem] shadow-inner"
                                style={{ backgroundColor: `${confirmingHabit.color}15`, color: confirmingHabit.color }}
                            >
                                {React.createElement(IconMap[confirmingHabit.icon || 'StarIcon'] || StarIcon, { className: "w-12 h-12" })}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-800 dark:text-slate-100">Ritual Complete?</h3>
                                <p className="text-sm font-sans text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    Have you finished your practice of <span className="font-bold" style={{ color: confirmingHabit.color }}>"{confirmingHabit.name}"</span> for today?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button 
                                    onClick={() => setConfirmingHabitId(null)}
                                    className="py-4 rounded-2xl font-bold font-sans text-xs uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 transition-colors"
                                >
                                    Not yet
                                </button>
                                <button 
                                    onClick={confirmCompletion}
                                    className="py-4 rounded-2xl font-bold font-sans text-xs uppercase tracking-widest text-white shadow-lg shadow-pink-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
                                    style={{ backgroundColor: confirmingHabit.color }}
                                >
                                    Yes, I have
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700/50 relative">
                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-200 mb-6">Add New Habit</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-2 flex-1">
                            <button 
                                onClick={() => setIsPersonalizerOpen(!isPersonalizerOpen)}
                                className={`h-full aspect-square p-4 rounded-2xl border-2 transition-all flex items-center justify-center ${isPersonalizerOpen ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 dark:bg-slate-700 border-transparent text-gray-400'}`}
                                style={{ borderColor: isPersonalizerOpen ? selectedColor : undefined, color: selectedColor }}
                                title="Personalize Habit"
                            >
                                <SelectedIconComp className="w-6 h-6" />
                            </button>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                                placeholder="What's your goal today?" 
                                className="flex-1 p-5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl outline-none text-base font-sans focus:ring-2 transition-all dark:text-slate-200" 
                                style={{ '--tw-ring-color': selectedColor } as any}
                            />
                        </div>
                        <button 
                            onClick={handleAddHabit} 
                            className="text-white p-5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 hover:brightness-110"
                            style={{ backgroundColor: selectedColor }}
                        >
                            <AddIcon className="w-6 h-6" />
                            <span className="sm:hidden font-bold uppercase tracking-widest text-xs">Add Habit</span>
                        </button>
                    </div>

                    {/* Icon & Color Library Drawer */}
                    {isPersonalizerOpen && (
                        <div className="mt-6 p-6 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-700 animate-fade-in z-20 shadow-inner">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personalization</p>
                                <button onClick={() => setIsPersonalizerOpen(false)}><XMarkIcon className="w-4 h-4 text-gray-400" /></button>
                            </div>
                            
                            <div className="mb-8">
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Theme Color</p>
                                <div className="flex flex-wrap gap-3">
                                    {HABIT_COLORS.map(color => (
                                        <button 
                                            key={color.value}
                                            onClick={() => { setSelectedColor(color.value); if ('vibrate' in navigator) navigator.vibrate(5); }}
                                            className={`w-10 h-10 rounded-full border-4 transition-all transform hover:scale-110 ${selectedColor === color.value ? 'border-white dark:border-slate-800 ring-2' : 'border-transparent'}`}
                                            style={{ backgroundColor: color.value, ringColor: color.value } as any}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                {Object.entries(HABIT_ICONS).map(([category, items]) => (
                                    <div key={category}>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">{category}</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                            {items.map(item => (
                                                <button 
                                                    key={item.id}
                                                    onClick={() => { setSelectedIconId(item.id); if ('vibrate' in navigator) navigator.vibrate(5); }}
                                                    className={`aspect-square p-3 rounded-xl flex items-center justify-center transition-all ${selectedIconId === item.id ? 'bg-white dark:bg-slate-800 shadow-md ring-2' : 'text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                                                    style={{ ringColor: selectedIconId === item.id ? selectedColor : 'transparent', color: selectedIconId === item.id ? selectedColor : undefined }}
                                                >
                                                    <item.Icon className="w-5 h-5" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Default Emerald Theme</span>
                    </button>
                )}
            </div>

            {/* Habit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map(habit => {
                    const isSpiritual = habit.id.startsWith('spiritual');
                    const description = (habit as any).description;
                    const themeColor = habit.color || '#E18AAA';
                    const HabitIconComp = (habit.icon && IconMap[habit.icon]) || StarIcon;
                    const hasHighStreak = (habit.streak || 0) >= 3;

                    return (
                        <div 
                            key={habit.id} 
                            className={`p-8 rounded-[2.5rem] transition-all duration-300 border-2 relative overflow-hidden ${
                                habit.completed 
                                ? 'bg-white/60 dark:bg-slate-800/60 opacity-80' 
                                : hasHighStreak 
                                    ? 'bg-white dark:bg-slate-800 shadow-xl ring-4 ring-opacity-10' 
                                    : 'bg-white dark:bg-slate-800 shadow-lg border-transparent'
                            }`}
                            style={{ 
                                borderColor: habit.completed ? `${themeColor}40` : hasHighStreak ? `${themeColor}20` : 'transparent',
                                ringColor: hasHighStreak ? `${themeColor}10` : 'transparent'
                            } as any}
                        >
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
                                <div 
                                    className="p-4 rounded-2xl shadow-sm transition-colors"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <HabitIconComp 
                                        className="w-10 h-10" 
                                        style={{ color: habit.completed ? `${themeColor}80` : themeColor }} 
                                    />
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-sans shadow-sm uppercase tracking-widest ${hasHighStreak ? 'text-white animate-pulse' : 'text-orange-500'}`} style={{ backgroundColor: hasHighStreak ? themeColor : undefined }}>
                                    <span>🔥</span>
                                    <span>{habit.streak || 0} DAY</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <h3 
                                    className={`text-2xl font-bold font-serif leading-tight ${habit.completed ? 'text-gray-400 line-through decoration-2 dark:text-slate-500' : 'text-gray-800 dark:text-slate-200'}`}
                                    style={{ textDecorationColor: habit.completed ? `${themeColor}60` : undefined }}
                                >
                                    {habit.name}
                                </h3>
                                {hasHighStreak && !habit.completed && (
                                    <div className="animate-bounce">
                                        <FlameIcon className="w-5 h-5 fill-current" style={{ color: themeColor }} />
                                    </div>
                                )}
                            </div>
                            
                            {activeGuidanceId === habit.id && description && (
                                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-fade-in">
                                    <p className="text-xs font-sans text-emerald-800 dark:text-emerald-200 italic leading-relaxed">
                                        “{description}”
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => initiateToggle(habit)} 
                                    className={`flex-1 py-4 rounded-xl font-bold font-sans text-sm tracking-widest uppercase transition-all shadow-md active:scale-95 ${habit.completed ? 'bg-gray-100 text-gray-400 dark:bg-slate-700' : 'text-white hover:brightness-110'}`}
                                    style={{ backgroundColor: habit.completed ? undefined : themeColor }}
                                >
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
