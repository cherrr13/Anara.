import React, { useState, useMemo } from 'react';
import type { MoodEntry } from '../types';
import { CheckIcon, ExerciseIcon, MeditationIcon, SocializingIcon, CreativeIcon, WorkIcon, RestIcon, NatureIcon, HappyMoodIcon, CalmMoodIcon, TiredMoodIcon, FrustratedMoodIcon, SadMoodIcon, GratefulMoodIcon, ReadingIcon } from './icons';

const moods = [
    { name: 'Happy', Icon: HappyMoodIcon, color: 'bg-yellow-100 text-yellow-700', darkColor: 'dark:bg-yellow-500/20 dark:text-yellow-300' },
    { name: 'Calm', Icon: CalmMoodIcon, color: 'bg-cyan-100 text-cyan-700', darkColor: 'dark:bg-cyan-500/20 dark:text-cyan-300' },
    { name: 'Tired', Icon: TiredMoodIcon, color: 'bg-indigo-100 text-indigo-700', darkColor: 'dark:bg-indigo-500/20 dark:text-indigo-300' },
    { name: 'Frustrated', Icon: FrustratedMoodIcon, color: 'bg-orange-100 text-orange-700', darkColor: 'dark:bg-orange-500/20 dark:text-orange-300' },
    { name: 'Sad', Icon: SadMoodIcon, color: 'bg-blue-100 text-blue-700', darkColor: 'dark:bg-blue-500/20 dark:text-blue-300' },
    { name: 'Grateful', Icon: GratefulMoodIcon, color: 'bg-pink-100 text-pink-700', darkColor: 'dark:bg-pink-500/20 dark:text-pink-300' },
] as const;

type MoodName = typeof moods[number]['name'];

const activities = [
    { name: 'Exercise', Icon: ExerciseIcon },
    { name: 'Meditation', Icon: MeditationIcon },
    { name: 'Socializing', Icon: SocializingIcon },
    { name: 'Reading', Icon: ReadingIcon },
    { name: 'Creative', Icon: CreativeIcon },
    { name: 'Work', Icon: WorkIcon },
    { name: 'Rest', Icon: RestIcon },
    { name: 'Nature', Icon: NatureIcon },
];

interface MoodTrackerScreenProps {
    moodHistory: MoodEntry[];
    onAddMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
}

const MoodCalendar: React.FC<{ moodHistory: MoodEntry[] }> = ({ moodHistory }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const moodsByDate = useMemo(() => {
        const map = new Map<string, MoodEntry>();
        moodHistory.forEach(entry => {
            const dateKey = new Date(entry.date).toDateString();
            if (!map.has(dateKey)) {
                map.set(dateKey, entry);
            }
        });
        return map;
    }, [moodHistory]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-full aspect-square"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayKey = dayDate.toDateString();
        const entry = moodsByDate.get(dayKey);
        const isToday = new Date().toDateString() === dayKey;
        const MoodIcon = entry ? moods.find(m => m.name === entry.mood)?.Icon : null;

        let dayClasses = "w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors";
        
        if (entry) {
            dayClasses += " bg-[#FCE7F3] dark:bg-pink-900/50 p-1"; // Mood logged
        } else {
            dayClasses += " bg-gray-100 dark:bg-slate-700/50"; // Empty day
        }

        if (isToday) {
            dayClasses += " ring-2 ring-[#F4ABC4] dark:ring-pink-500"; // Today
        }
        
        calendarDays.push(
            <div key={day} className={dayClasses}>
                {MoodIcon ? <MoodIcon className="w-full h-full"/> : <span className="text-gray-500 dark:text-slate-400">{day}</span>}
            </div>
        );
    }
     return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-gray-600 dark:text-slate-300">&lt;</button>
                <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-gray-600 dark:text-slate-300">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 dark:text-slate-400 font-semibold mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {calendarDays}
            </div>
        </div>
    );
};


const MoodTrackerScreen: React.FC<MoodTrackerScreenProps> = ({ moodHistory, onAddMoodEntry }) => {
    const [selectedMood, setSelectedMood] = useState<MoodName | null>(null);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    
    const toggleActivity = (activityName: string) => {
        setSelectedActivities(prev => 
            prev.includes(activityName) 
            ? prev.filter(a => a !== activityName)
            : [...prev, activityName]
        );
    };
    
    const resetForm = () => {
        setSelectedMood(null);
        setSelectedActivities([]);
        setNote('');
    };

    const handleSubmit = () => {
        if (selectedMood) {
            onAddMoodEntry({
                mood: selectedMood,
                activities: selectedActivities,
                note,
            });
            if ('vibrate' in navigator) {
                navigator.vibrate(100); // A slightly more prominent vibration for saving
            }
            resetForm();
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 2500);
        }
    };

    return (
        <div className="relative space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>How are you feeling?</h2>
                    <p className="text-sm text-[#8D7F85] dark:text-slate-400">Select your mood, activities, and add any notes</p>
                </div>
                <button onClick={() => setShowLegend(!showLegend)} className="text-sm font-semibold text-[#E18AAA] dark:text-pink-400 border border-[#F4ABC4] dark:border-pink-500/50 rounded-full px-4 py-1.5 hover:bg-[#FCE7F3] dark:hover:bg-pink-900/50 transition-colors">
                    Show Legend
                </button>
            </div>

            {showLegend && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-slate-300 animate-fade-in">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#FCE7F3] dark:bg-pink-900/50"></div>
                        <span>Mood logged</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded ring-2 ring-[#F4ABC4] dark:ring-pink-500"></div>
                        <span>Today</span>
                    </div>
                </div>
            )}

            <MoodCalendar moodHistory={moodHistory} />

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-3 text-lg">Select your mood</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {moods.map(({ name, Icon, color, darkColor }) => (
                            <button
                                key={name}
                                onClick={() => setSelectedMood(name)}
                                aria-pressed={selectedMood === name}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${selectedMood === name ? 'ring-2 ring-[#E18AAA] dark:ring-pink-500 scale-105 shadow-md' : 'hover:shadow-md'} ${color} ${darkColor}`}
                            >
                                <div className="w-12 h-12 mb-1">
                                    <Icon className="w-full h-full" />
                                </div>
                                <span className="text-sm font-semibold">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                 <div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-3 text-lg">What did you do today? <span className="font-normal text-gray-500 dark:text-slate-400">(optional)</span></h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {activities.map(({name, Icon}) => (
                            <button
                                key={name}
                                onClick={() => toggleActivity(name)}
                                className={`flex items-center gap-2 py-2.5 px-4 rounded-lg border-2 transition-all duration-200 ease-in-out transform ${selectedActivities.includes(name) ? 'bg-[#E0D9FE] border-[#C4B5FD] text-indigo-800 scale-105 shadow-lg dark:bg-indigo-500/30 dark:border-indigo-500 dark:text-indigo-300' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#C4B5FD] hover:scale-105 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400'}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-2 text-lg">Add notes <span className="font-normal text-gray-500 dark:text-slate-400">(optional)</span></h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] focus:border-[#F4ABC4] transition bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 focus:dark:ring-pink-500 focus:dark:border-pink-500"
                        rows={4}
                    ></textarea>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-2">
                     <button
                        onClick={resetForm}
                        className="font-bold py-3 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-600 dark:text-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedMood}
                        className="bg-[#E18AAA] text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-300 disabled:dark:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        Save Mood
                    </button>
                </div>
            </div>

            {/* Confirmation Toast */}
            {showConfirmation && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#A7D7C5] dark:bg-teal-600 text-white py-2 px-6 rounded-full shadow-lg flex items-center animate-fade-in-out">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    <span>Entry Saved!</span>
                </div>
            )}
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(20px) translateX(-50%); }
                    10% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    90% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    100% { opacity: 0; transform: translateY(20px) translateX(-50%); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 2.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};

export default MoodTrackerScreen;