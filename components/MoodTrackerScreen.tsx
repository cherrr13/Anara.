
import React, { useState, useMemo } from 'react';
import type { MoodEntry } from '../types';
import { 
    CheckIcon, ExerciseIcon, MeditationIcon, SocializingIcon, CreativeIcon, 
    WorkIcon, RestIcon, NatureIcon, HappyMoodIcon, CalmMoodIcon, 
    TiredMoodIcon, FrustratedMoodIcon, SadMoodIcon, GratefulMoodIcon, 
    ReadingIcon, DeleteIcon, AddIcon, XMarkIcon, BackIcon, SparklesIcon,
    WalkingIcon, SearchIcon
} from './icons';

// Helper to normalize dates for mapping
const getDateString = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const moods = [
    { name: 'Happy', Icon: HappyMoodIcon, color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', barColor: 'bg-yellow-400' },
    { name: 'Calm', Icon: CalmMoodIcon, color: 'bg-cyan-100 text-cyan-700', border: 'border-cyan-200', barColor: 'bg-cyan-400' },
    { name: 'Tired', Icon: TiredMoodIcon, color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200', barColor: 'bg-indigo-400' },
    { name: 'Frustrated', Icon: FrustratedMoodIcon, color: 'bg-orange-100 text-orange-700', border: 'border-orange-200', barColor: 'bg-orange-400' },
    { name: 'Sad', Icon: SadMoodIcon, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', barColor: 'bg-blue-400' },
    { name: 'Grateful', Icon: GratefulMoodIcon, color: 'bg-pink-100 text-pink-700', border: 'border-pink-200', barColor: 'bg-pink-400' },
] as const;

const categorizedActivities = {
    'Physical': [
        { name: 'Exercise', Icon: ExerciseIcon },
        { name: 'Walking', Icon: WalkingIcon },
        { name: 'Rest', Icon: RestIcon },
        { name: 'Nature', Icon: NatureIcon },
    ],
    'Mind & Soul': [
        { name: 'Meditation', Icon: MeditationIcon },
        { name: 'Reading', Icon: ReadingIcon },
        { name: 'Creative', Icon: CreativeIcon },
    ],
    'Daily & Social': [
        { name: 'Work', Icon: WorkIcon },
        { name: 'Socializing', Icon: SocializingIcon },
    ]
};

// Flatten for search
const allActivities = Object.values(categorizedActivities).flat();

const MoodIconMap: Record<string, React.FC<{ className?: string }>> = {
    'Happy': HappyMoodIcon,
    'Calm': CalmMoodIcon,
    'Tired': TiredMoodIcon,
    'Frustrated': FrustratedMoodIcon,
    'Sad': SadMoodIcon,
    'Grateful': GratefulMoodIcon
};

// --- TREND CHART COMPONENT ---
const MoodTrendChart: React.FC<{ history: MoodEntry[] }> = ({ history }) => {
    const distribution = useMemo(() => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const counts: Record<string, number> = {
            'Happy': 0, 'Calm': 0, 'Tired': 0, 'Frustrated': 0, 'Sad': 0, 'Grateful': 0
        };

        history.forEach(entry => {
            if (new Date(entry.date) >= lastWeek) {
                counts[entry.mood] = (counts[entry.mood] || 0) + 1;
            }
        });

        const maxCount = Math.max(...Object.values(counts), 1);
        return moods.map(m => ({
            ...m,
            count: counts[m.name],
            percent: (counts[m.name] / maxCount) * 100
        }));
    }, [history]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-6">Weekly Distribution</h3>
            <div className="flex items-end justify-between h-40 gap-2 mb-4">
                {distribution.map(item => (
                    <div key={item.name} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="text-[10px] font-bold text-gray-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">
                            {item.count}
                        </div>
                        <div 
                            className={`w-full max-w-[24px] rounded-t-xl transition-all duration-700 ease-out shadow-sm ${item.barColor}`}
                            style={{ height: `${item.percent}%` }}
                        ></div>
                        <div className="mt-3">
                            <item.Icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between px-2">
                {distribution.map(item => (
                    <span key={item.name} className="flex-1 text-center text-[8px] font-bold text-gray-400 uppercase tracking-tighter truncate px-1">
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- CALENDAR COMPONENT ---
const MoodCalendar: React.FC<{ history: MoodEntry[] }> = ({ history }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
    
    const moodMap = useMemo(() => {
        const map = new Map<string, MoodEntry>();
        // Process chronologically so the latest entry for a day wins
        [...history].sort((a, b) => a.date.getTime() - b.date.getTime()).forEach(entry => {
            map.set(getDateString(entry.date), entry);
        });
        return map;
    }, [history]);

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        setViewDate(new Date(year, month + offset, 1));
    };

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="aspect-square" />);
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = getDateString(new Date(year, month, d));
        const entry = moodMap.get(dateKey);
        const mood = entry?.mood;
        const Icon = mood ? MoodIconMap[mood] : null;
        const isToday = getDateString(new Date()) === dateKey;

        days.push(
            <div 
                key={d} 
                onClick={() => entry && setSelectedEntry(entry)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all ${
                    entry ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:scale-105 shadow-sm hover:shadow-md' : ''
                } ${
                    isToday ? 'bg-pink-50 dark:bg-pink-900/20 ring-1 ring-pink-200 dark:ring-pink-800' : ''
                }`}
            >
                <span className={`text-[10px] font-bold ${mood ? 'text-gray-400 mb-1' : 'text-gray-500'}`}>{d}</span>
                {Icon && <Icon className="w-6 h-6 animate-pop" />}
                {isToday && !mood && <div className="w-1 h-1 bg-pink-400 rounded-full mt-1"></div>}
                {entry && <div className="absolute top-1 right-1 w-1 h-1 bg-pink-200 dark:bg-pink-800 rounded-full"></div>}
            </div>
        );
    }

    const selectedMoodData = useMemo(() => {
        if (!selectedEntry) return null;
        return moods.find(m => m.name === selectedEntry.mood);
    }, [selectedEntry]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors">
                    <BackIcon className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-center">
                    <h3 className="font-bold font-serif text-xl text-gray-800 dark:text-slate-100">
                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                </div>
                <button onClick={() => changeMonth(1)} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors">
                    <BackIcon className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>

            {/* Modal for Day Details */}
            {selectedEntry && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedEntry(null)}
                >
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-sm w-full shadow-2xl animate-pop relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedEntry(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 z-10">
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className={`p-6 rounded-[2rem] ${selectedMoodData?.color} ${selectedMoodData?.border} border shadow-inner`}>
                                {selectedMoodData && <selectedMoodData.Icon className="w-16 h-16" />}
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-800 dark:text-slate-100">{selectedEntry.mood}</h3>
                                <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-[0.2em] mt-1">
                                    {new Date(selectedEntry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            {selectedEntry.activities.length > 0 && (
                                <div className="w-full">
                                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3">Contextual Activities</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {selectedEntry.activities.map(act => {
                                            const actData = allActivities.find(a => a.name === act);
                                            return (
                                                <div key={act} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center gap-2 border border-gray-100 dark:border-slate-700 shadow-sm">
                                                    {actData && <actData.Icon className="w-3 h-3 text-indigo-400" />}
                                                    <span className="text-[10px] font-bold font-sans text-gray-600 dark:text-slate-300 uppercase tracking-tight">{act}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedEntry.note && (
                                <div className="w-full pt-4 border-t border-gray-50 dark:border-slate-700">
                                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2">Reflections</p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-slate-300 italic leading-relaxed">
                                        "{selectedEntry.note}"
                                    </p>
                                </div>
                            )}

                            {!selectedEntry.note && !selectedEntry.activities.length && (
                                <div className="flex items-center gap-2 text-gray-400 italic text-xs font-sans">
                                    <SparklesIcon className="w-4 h-4 opacity-40" />
                                    <span>Pure emotion, captured in silence.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface MoodTrackerScreenProps {
    moodHistory: MoodEntry[];
    onAddMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
}

const MoodTrackerScreen: React.FC<MoodTrackerScreenProps> = ({ moodHistory, onAddMoodEntry }) => {
    const [selectedMood, setSelectedMood] = useState<typeof moods[number]['name'] | null>(null);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [activitySearch, setActivitySearch] = useState('');

    const filteredActivities = useMemo(() => {
        if (!activitySearch.trim()) return null;
        return allActivities.filter(a => a.name.toLowerCase().includes(activitySearch.toLowerCase()));
    }, [activitySearch]);

    const handleSubmit = () => {
        if (selectedMood) {
            onAddMoodEntry({ mood: selectedMood, activities: selectedActivities, note });
            setSelectedMood(null); setSelectedActivities([]); setNote('');
            setShowConfirmation(true); setTimeout(() => setShowConfirmation(false), 2500);
            if ('vibrate' in navigator) navigator.vibrate(50);
        }
    };

    const toggleActivity = (name: string) => {
        setSelectedActivities(prev => 
            prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
        );
    };

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header Standardized */}
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Mood Lab</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">Capture your emotional state and track your growth over time.</p>
            </div>

            {/* Weekly Trends Section */}
            <MoodTrendChart history={moodHistory} />

            {/* Monthly Calendar View */}
            <MoodCalendar history={moodHistory} />

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 space-y-10 border border-gray-100 dark:border-slate-700">
                <div>
                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-6">How are you feeling now?</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {moods.map(({ name, Icon, color }) => (
                            <button key={name} onClick={() => setSelectedMood(name)} className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-300 ${selectedMood === name ? 'ring-4 ring-[#E18AAA] scale-105 shadow-lg z-10' : 'opacity-60 hover:opacity-100'} ${color}`}>
                                <Icon className="w-12 h-12 mb-2" />
                                <span className="text-[10px] font-bold font-sans uppercase tracking-widest">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Contextual Activities</h3>
                        <div className="relative flex-grow max-w-xs">
                            <input 
                                type="text"
                                value={activitySearch}
                                onChange={(e) => setActivitySearch(e.target.value)}
                                placeholder="Search activities..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#F4ABC4] transition-all text-sm font-sans"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {activitySearch && (
                                <button onClick={() => setActivitySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredActivities ? (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Search Results</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {filteredActivities.map(({ name, Icon }) => (
                                    <button key={name} onClick={() => toggleActivity(name)} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-sans font-bold text-sm ${selectedActivities.includes(name) ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-600 dark:text-indigo-200 shadow-md' : 'bg-gray-50 border-transparent text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="uppercase tracking-wide text-[10px]">{name}</span>
                                    </button>
                                ))}
                                {filteredActivities.length === 0 && (
                                    <div className="col-span-full py-4 text-center text-gray-400 italic text-sm">No activities match your search.</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            {Object.entries(categorizedActivities).map(([category, items]) => (
                                <div key={category} className="space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{category}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {items.map(({ name, Icon }) => (
                                            <button key={name} onClick={() => toggleActivity(name)} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-sans font-bold text-sm ${selectedActivities.includes(name) ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-600 dark:text-indigo-200 shadow-md' : 'bg-gray-50 border-transparent text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                <Icon className="w-5 h-5" />
                                                <span className="uppercase tracking-wide text-[10px]">{name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-4">Reflections</h3>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What's weighing on your heart or making it light? Write it here..." rows={4} className="w-full p-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-3xl focus:ring-2 focus:ring-[#F4ABC4] outline-none text-base font-sans leading-relaxed dark:text-slate-200" />
                </div>

                <button onClick={handleSubmit} disabled={!selectedMood} className="w-full bg-[#E18AAA] hover:bg-pink-600 text-white font-bold font-sans py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100">Save Mood Memory</button>
            </div>

            {showConfirmation && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-teal-500 text-white py-3 px-8 rounded-full shadow-2xl flex items-center animate-pop font-bold z-50">
                    <CheckIcon className="h-5 w-5 mr-3" />
                    <span className="text-[10px] font-sans uppercase tracking-widest">Mood Logged Successfully</span>
                </div>
            )}
        </div>
    );
};

export default MoodTrackerScreen;
