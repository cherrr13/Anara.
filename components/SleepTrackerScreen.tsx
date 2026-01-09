
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { SleepEntry, User } from '../types';
import { BedIcon, CheckIcon, DeleteIcon, MoonIcon, StarIcon, SparklesIcon, BackIcon, XMarkIcon } from './icons';

// Helper to normalize dates for mapping
const getDateString = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const qualityConfig = {
    Excellent: { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-100', stars: 4 },
    Good: { color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-100', stars: 3 },
    Fair: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-indigo-100', stars: 2 },
    Poor: { color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-100', stars: 1 }
};

// --- SLEEP CALENDAR COMPONENT ---
interface SleepCalendarProps {
    history: SleepEntry[];
    onSelectEntry: (entry: SleepEntry) => void;
}

const SleepCalendar: React.FC<SleepCalendarProps> = ({ history, onSelectEntry }) => {
    const [viewDate, setViewDate] = useState(new Date());
    
    const sleepMap = useMemo(() => {
        const map = new Map<string, SleepEntry>();
        // Latest entry for a day wins
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
        const dayDate = new Date(year, month, d);
        const dateKey = getDateString(dayDate);
        const entry = sleepMap.get(dateKey);
        const isToday = getDateString(new Date()) === dateKey;
        const config = entry ? qualityConfig[entry.quality] : null;

        days.push(
            <div 
                key={d} 
                onClick={() => entry && onSelectEntry(entry)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all group ${
                    entry ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:scale-105 shadow-sm active:scale-95' : ''
                } ${
                    isToday ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900' : ''
                }`}
            >
                <span className={`text-[10px] font-bold ${entry ? 'text-gray-400 mb-1' : 'text-gray-500'}`}>{d}</span>
                {entry && (
                    <div className={`${config?.color} animate-pop`}>
                        <MoonIcon className="w-5 h-5 fill-current" />
                    </div>
                )}
                {isToday && !entry && <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1"></div>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors">
                    <BackIcon className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-center">
                    <h3 className="font-bold font-serif text-xl text-gray-800 dark:text-slate-100">
                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-[10px] font-bold font-sans text-indigo-400 uppercase tracking-widest mt-1">Rest Cycle</p>
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
        </div>
    );
};

// --- BAR CHART COMPONENT ---
const SleepBarChart: React.FC<{ history: SleepEntry[] }> = ({ history }) => {
    const chartData = useMemo(() => {
        return [...history]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7);
    }, [history]);

    if (chartData.length === 0) {
        return <p className="text-center font-sans text-gray-400 py-8 italic">Start logging your nights to see your rest patterns.</p>;
    }

    const MAX_HOURS = 12;

    return (
        <div className="mb-6 relative h-48 pt-6 select-none border-b border-gray-100 dark:border-slate-700">
            <div className="flex items-end justify-between gap-2 px-2 h-full pb-6 relative z-10">
                {chartData.map((entry, i) => (
                    <div key={entry.id || i} className="flex-1 flex flex-col items-center gap-1 group cursor-default h-full justify-end">
                        <div className="relative w-full flex justify-center items-end h-full">
                            <div 
                                className={`w-full max-w-[20px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80 ${entry.durationHours >= 7 ? 'bg-indigo-400' : 'bg-pink-300'}`}
                                style={{ height: `${Math.min(entry.durationHours / MAX_HOURS * 100, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] font-bold font-sans text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                            {new Date(entry.date).toLocaleDateString('en-US', {weekday: 'short'})}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SLEEP TRACKER SCREEN PROPS ---
interface SleepTrackerScreenProps {
    user: User | null;
    sleepHistory: SleepEntry[];
    onAddEntry: (entry: SleepEntry) => void;
    onDeleteEntry: (id: string) => void;
}

const SleepTrackerScreen: React.FC<SleepTrackerScreenProps> = ({ user, sleepHistory, onAddEntry, onDeleteEntry }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [quality, setQuality] = useState<SleepEntry['quality']>('Good');
    const [notes, setNotes] = useState('');
    
    const [sleepInsight, setSleepInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<SleepEntry | null>(null);

    const calculateDuration = (start: string, end: string) => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (diffMinutes < 0) diffMinutes += 24 * 60;
        return (diffMinutes / 60).toFixed(1);
    };

    const duration = calculateDuration(bedTime, wakeTime);

    const generateSleepInsight = async (newEntry: SleepEntry) => {
        setIsInsightLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `User: ${user?.name}. Logged Sleep: ${newEntry.durationHours}h (${newEntry.quality}). Give 1 concise, empathetic piece of sleep advice. Max 2 sentences.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { maxOutputTokens: 100, systemInstruction: "You are Nara, a world-class sleep coach." }
            });
            if (response.text) setSleepInsight(response.text.trim());
        } catch { setSleepInsight("Focus on a consistent wind-down ritual for better restorative sleep."); }
        finally { setIsInsightLoading(false); }
    };

    const handleSubmit = async () => {
        const newEntry: SleepEntry = { id: Date.now().toString(), date: new Date(date), bedTime, wakeTime, durationHours: parseFloat(duration), quality, notes };
        onAddEntry(newEntry);
        setNotes('');
        await generateSleepInsight(newEntry);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 max-w-2xl mx-auto">
            {/* Header Standardized */}
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Sleep Sanctuary</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">Nurturing the quiet hours of your restoration.</p>
            </div>

            {/* Reflection Modal */}
            {selectedEntry && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedEntry(null)}
                >
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-pop relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedEntry(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 z-10">
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className={`p-6 rounded-[2rem] ${qualityConfig[selectedEntry.quality].bg} ${qualityConfig[selectedEntry.quality].border} border shadow-inner`}>
                                <MoonIcon className={`w-16 h-16 ${qualityConfig[selectedEntry.quality].color} fill-current`} />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold font-serif text-gray-800 dark:text-slate-100">{selectedEntry.durationHours} Hours of Rest</h3>
                                <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-[0.2em] mt-1">
                                    {new Date(selectedEntry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bedtime</p>
                                    <p className="font-serif font-bold text-indigo-500">{selectedEntry.bedTime}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Wake Up</p>
                                    <p className="font-serif font-bold text-indigo-500">{selectedEntry.wakeTime}</p>
                                </div>
                            </div>

                            <div className="w-full">
                                <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3">Rest Quality</p>
                                <div className="flex justify-center gap-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <StarIcon 
                                            key={i} 
                                            className={`w-4 h-4 ${i < qualityConfig[selectedEntry.quality].stars ? qualityConfig[selectedEntry.quality].color : 'text-gray-200 dark:text-slate-700'}`} 
                                        />
                                    ))}
                                </div>
                            </div>

                            {selectedEntry.notes && (
                                <div className="w-full pt-4 border-t border-gray-50 dark:border-slate-700">
                                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2">Dream Notes</p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-slate-300 italic leading-relaxed">
                                        "{selectedEntry.notes}"
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => { onDeleteEntry(selectedEntry.id); setSelectedEntry(null); }}
                                className="text-xs font-bold font-sans text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                            >
                                Remove Log
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Insight Section Standardized */}
            {(sleepInsight || isInsightLoading) && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-[2rem] p-6 shadow-md animate-pop">
                    <div className="flex items-center gap-2 mb-3">
                        <SparklesIcon className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-[10px] font-bold font-sans uppercase tracking-widest text-indigo-600">Nara's Sleep Insight</h3>
                    </div>
                    <p className="text-base font-serif italic text-gray-800 dark:text-slate-200">
                        {isInsightLoading ? "Analyzing your rest patterns..." : sleepInsight}
                    </p>
                </div>
            )}

            {/* Interactive Calendar */}
            <SleepCalendar history={sleepHistory} onSelectEntry={setSelectedEntry} />

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-8">Log New Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                         <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3 block">Sleep Date</label>
                         <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl outline-none font-sans dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3 block">Bedtime</label>
                             <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl outline-none font-sans dark:text-white" />
                        </div>
                        <div>
                             <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3 block">Wake Up</label>
                             <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl outline-none font-sans dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-slate-700/50 rounded-2xl flex justify-between items-center border border-indigo-100 dark:border-slate-600">
                    <span className="text-sm font-bold font-sans text-gray-500 uppercase tracking-widest">Calculated Duration</span>
                    <span className="text-3xl font-bold font-serif text-indigo-600 dark:text-indigo-400">{duration} hrs</span>
                </div>

                <div className="mt-8">
                    <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block text-center">How was your sleep quality?</label>
                    <div className="flex justify-center gap-4">
                        {(['Poor', 'Fair', 'Good', 'Excellent'] as SleepEntry['quality'][]).map(q => (
                            <button key={q} onClick={() => setQuality(q)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quality === q ? 'bg-indigo-500 text-white scale-125 shadow-lg' : 'bg-gray-100 text-gray-300 dark:bg-slate-700'}`}>
                                <StarIcon className="w-6 h-6" />
                            </button>
                        ))}
                    </div>
                    <p className="text-center font-sans font-bold text-indigo-500 mt-4 uppercase tracking-widest text-xs">{quality}</p>
                </div>

                <div className="mt-8">
                    <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Sleep Notes & Observations</label>
                    <textarea 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Log caffeine intake, stress levels, or any other factors that affected your rest..." 
                        rows={3} 
                        className="w-full p-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none font-sans text-base shadow-inner focus:ring-2 focus:ring-indigo-200 transition-all dark:text-slate-200"
                    />
                </div>

                <button onClick={handleSubmit} className="w-full mt-10 bg-[#E18AAA] hover:bg-pink-600 text-white font-bold font-sans py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CheckIcon className="w-5 h-5" /> Save Sleep Entry
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-lg p-8 border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-6">Trends & Recent Nights</h3>
                <SleepBarChart history={sleepHistory} />
                <div className="space-y-3 mt-6">
                    {sleepHistory.slice().reverse().slice(0, 3).map(entry => (
                        <div 
                            key={entry.id} 
                            onClick={() => setSelectedEntry(entry)}
                            className="flex flex-col p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all"
                        >
                             <div className="flex justify-between items-center">
                                 <div>
                                     <p className="font-bold font-sans text-gray-700 dark:text-slate-200 text-sm uppercase tracking-wider">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                     <p className="text-xs font-sans text-gray-400 dark:text-slate-500">{entry.bedTime} - {entry.wakeTime} • {entry.quality}</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <span className={`font-serif font-bold text-xl ${entry.durationHours >= 7 ? 'text-indigo-500' : 'text-pink-400'}`}>{entry.durationHours}h</span>
                                    <div className={`${qualityConfig[entry.quality].color}`}>
                                        <MoonIcon className="w-4 h-4 fill-current" />
                                    </div>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SleepTrackerScreen;
