
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Cycle, DayLog, PeriodFlow, Habit } from '../types';
import { 
    WarningIcon, MenstrualPhaseIcon, FollicularPhaseIcon, OvulationPhaseIcon, LutealPhaseIcon, AddIcon, CheckIcon,
    DzikirIcon, MurajaahIcon, DuaIcon, ListenIcon,
    GentleExerciseIcon, SupplementIcon, WaterDropIcon, AppleFruitIcon, MoonIcon, SparklesIcon, GardenIcon, BackIcon, XMarkIcon, RestIcon,
    BrainIcon, MoodIcon
} from './icons';

// --- UTILITY FUNCTIONS ---
const getISODateString = (date: Date): string => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

// --- CONFIGURATION ---
const symptomsList = [
    'Cramps', 'Headache', 'Fatigue', 'Mood Swings', 'Bloating', 'Acne', 'Back Pain', 'Nausea'
];
const flowTypes: PeriodFlow[] = ['Spotting', 'Light', 'Medium', 'Heavy'];

const detectCyclesFromLogs = (logs: Record<string, DayLog>): Cycle[] => {
    const flowDates = Object.keys(logs)
        .filter(date => logs[date].flow !== null)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    if (flowDates.length === 0) return [];

    const detectedCycles: Cycle[] = [];
    let currentStart = flowDates[0];
    let currentEnd = flowDates[0];

    for (let i = 1; i < flowDates.length; i++) {
        const date = new Date(flowDates[i]);
        const prevDate = new Date(flowDates[i - 1]);
        const diffDays = (date.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

        if (diffDays > 5) { 
             const length = Math.ceil((new Date(currentEnd).getTime() - new Date(currentStart).getTime()) / (1000 * 3600 * 24)) + 1;
             detectedCycles.push({ id: currentStart, startDate: currentStart, length: length });
             currentStart = flowDates[i];
        }
        currentEnd = flowDates[i];
    }
    const length = Math.ceil((new Date(currentEnd).getTime() - new Date(currentStart).getTime()) / (1000 * 3600 * 24)) + 1;
    detectedCycles.push({ id: currentStart, startDate: currentStart, length: length });
    return detectedCycles;
};

// --- CALENDAR COMPONENT ---
interface PeriodCalendarProps {
    calendarDate: Date;
    setCalendarDate: (date: Date) => void;
    dayLogs: Record<string, DayLog>;
    cycles: Cycle[];
    insights: any;
    onDateSelect: (dateStr: string) => void;
    selectedDate: string;
}

const PeriodCalendar: React.FC<PeriodCalendarProps> = ({ calendarDate, setCalendarDate, dayLogs, cycles, insights, onDateSelect, selectedDate }) => {
    const [showLegend, setShowLegend] = useState(false);
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });
    const year = calendarDate.getFullYear();

    const daysInMonth = new Date(year, calendarDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, calendarDate.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        setCalendarDate(new Date(year, calendarDate.getMonth() + offset, 1));
    };

    const predictions = useMemo(() => {
        const events = new Map<string, string>();
        if(cycles.length === 0) return events;

        const avgCycleLen = insights.avgCycle || 28;
        const lastCycleStart = new Date(cycles[cycles.length - 1].startDate + 'T00:00:00');
        const lastCycleLen = cycles[cycles.length - 1].length || 5;

        let predictedStart = new Date(lastCycleStart);
        for(let i=0; i < 6; i++) {
             predictedStart = addDays(predictedStart, avgCycleLen);
             const ovulation = addDays(predictedStart, -14);
             const fertileStart = addDays(ovulation, -5);

             const markDate = (d: Date, type: string) => {
                 const s = getISODateString(d);
                 if(!events.has(s) || type === 'ovulation') events.set(s, type);
             }

             for(let d = 0; d < lastCycleLen; d++) markDate(addDays(predictedStart, d), 'predicted-period');
             for(let d = 0; d <= 6; d++) {
                 const fDay = addDays(fertileStart, d);
                 markDate(fDay, 'fertile');
             }
             markDate(ovulation, 'ovulation');
        }
        return events;
    }, [cycles, insights.avgCycle, year, calendarDate.getMonth()]);

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(<div key={`empty-${i}`} className="w-full aspect-square"></div>);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, calendarDate.getMonth(), day);
        const dayKey = getISODateString(dayDate);
        const todayKey = getISODateString(new Date());

        const log = dayLogs[dayKey];
        const isPeriodDay = !!log?.flow;
        const predictionType = predictions.get(dayKey);
        const isSelected = dayKey === selectedDate;
        
        let dayClasses = "w-full aspect-square flex flex-col items-center justify-center rounded-2xl text-sm transition-all cursor-pointer relative group ";
        let content = <span>{day}</span>;
        let decoration = null;

        if (isPeriodDay) {
            dayClasses += "bg-[#E18AAA] text-white font-bold shadow-lg shadow-pink-200 dark:shadow-none";
        } else if (predictionType === 'ovulation') {
            dayClasses += "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 font-bold border-2 border-white dark:border-slate-800 shadow-md scale-105 z-10";
            content = <OvulationPhaseIcon className="w-6 h-6" />;
        } else if (predictionType === 'fertile') {
            dayClasses += "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800";
            decoration = <SparklesIcon className="w-2 h-2 absolute top-1 right-1 text-emerald-400" />;
        } else if (predictionType === 'predicted-period') {
             dayClasses += "bg-pink-50/50 dark:bg-pink-900/10 text-pink-400 border border-dashed border-pink-200 dark:border-pink-800";
        } else {
            dayClasses += "bg-gray-50/50 text-gray-700 hover:bg-gray-100 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700";
        }
        
        if (dayKey === todayKey) dayClasses += " ring-2 ring-indigo-400 dark:ring-indigo-600 ";
        if (isSelected) dayClasses += " scale-110 ring-4 ring-pink-300 dark:ring-pink-700 z-20 shadow-xl brightness-110";

        calendarDays.push(
            <div key={day} className={dayClasses} onClick={() => onDateSelect(dayKey)}>
                {content}
                {decoration}
                {(log?.symptoms?.length > 0 || log?.basalBodyTemp || log?.notes) && !isPeriodDay && <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => changeMonth(-1)} className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 transition-colors">
                    <BackIcon className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-center">
                    <h3 className="font-bold font-serif text-2xl text-gray-800 dark:text-slate-200">{monthName}</h3>
                    <p className="text-[10px] font-bold font-sans text-[#E18AAA] uppercase tracking-[0.2em]">{year}</p>
                </div>
                <button onClick={() => changeMonth(1)} className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 transition-colors">
                    <BackIcon className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-sans text-gray-400 dark:text-slate-500 font-bold mb-6 uppercase tracking-widest">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-3">
                {calendarDays}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
interface PeriodTrackerProps {
    cycles: Cycle[];
    onUpdateCycles: (cycles: Cycle[]) => void;
    dayLogs: Record<string, DayLog>;
    setDayLogs: (logs: Record<string, DayLog>) => void;
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    isIslamicGuidanceOn: boolean;
}

const PeriodTrackerScreen: React.FC<PeriodTrackerProps> = ({ cycles, onUpdateCycles, dayLogs, setDayLogs, habits, setHabits, isIslamicGuidanceOn }) => {
    const [logDate, setLogDate] = useState(getISODateString(new Date()));
    const [logFlow, setLogFlow] = useState<PeriodFlow | null>(null);
    const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
    const [logNotes, setLogNotes] = useState('');
    
    const [calendarDate, setCalendarDate] = useState(new Date());
    
    const [aiPrediction, setAiPrediction] = useState<{ date: string, tip: string, forecast: string } | null>(null);
    const [symptomInsight, setSymptomInsight] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const logFormRef = useRef<HTMLDivElement>(null);

    const fetchAiInsights = async () => {
        if (cycles.length < 1) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Format logs into a summary for the AI
            const logSummary = Object.entries(dayLogs)
                .slice(-30)
                .map(([date, log]) => {
                    const entry = log as DayLog;
                    return `${date}: Flow ${entry.flow || 'None'}, Symptoms: ${entry.symptoms.join(', ') || 'None'}`;
                })
                .join('; ');

            const cycleContext = cycles.slice(-5).map(c => `Started: ${c.startDate}, Duration: ${c.length} days`).join('; ');
            
            const prompt = `
                I am a user tracking my menstrual health in an app called Anara.
                CURRENT DATE: ${getISODateString(new Date())}
                CYCLE HISTORY: ${cycleContext}
                DAILY LOGS (Symptom Patterns): ${logSummary}

                TASK:
                1. Predict the start date of the NEXT period based on historical variability (YYYY-MM-DD).
                2. Provide a "Symptom Forecast" for the next 3 days. Analyze if recurring symptoms (like headaches or fatigue) usually happen at this stage of my cycle.
                3. Give 1 empowering wellness tip specific to my predicted phase.

                FORMAT: Return strictly JSON: {"date": "YYYY-MM-DD", "tip": "tip text", "forecast": "3-day symptom prediction and advice"}.
            `;

            const predResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const predResult = JSON.parse(predResponse.text || '{}');
            if (predResult.date) setAiPrediction(predResult);
            
            // Second prompt for long-term pattern recognition
            const analysisPrompt = `
                Analyze these long-term symptom trends logged over several cycles: ${logSummary}.
                Identify one specific recurring pattern (e.g. "You often experience bloating 3 days before ovulation").
                Provide one deeply practical, nurturing wellness advice for this pattern.
                Be succinct and empathetic. Max 35 words.
            `;

            const insightResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: analysisPrompt,
                config: { maxOutputTokens: 150 }
            });
            if (insightResponse.text) setSymptomInsight(insightResponse.text.trim());

        } catch (e) {
            console.error("AI Analysis Failed", e);
        } finally {
            setIsAiLoading(false);
        }
    };

    useEffect(() => {
        fetchAiInsights();
    }, [cycles, dayLogs]);

    useEffect(() => {
        const currentLog = dayLogs[logDate] || { flow: null, symptoms: [], notes: '' };
        setLogFlow(currentLog.flow || null);
        setLogSymptoms(currentLog.symptoms || []);
        setLogNotes(currentLog.notes || '');
    }, [logDate, dayLogs]);

    const handleDateSelect = (dateStr: string) => {
        setLogDate(dateStr);
        logFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const insights = useMemo(() => {
        const today = new Date();
        if (cycles.length === 0) return { currentCycleDay: 1, currentPhase: 'Follicular', nextPeriod: 'N/A', isFertile: false, avgCycle: 28, conceivingChance: 'Low' };
        const cycleLengths = cycles.length > 1 ? cycles.slice(1).map((c, i) => (new Date(c.startDate).getTime() - new Date(cycles[i].startDate).getTime()) / 86400000) : [];
        const avgCycle = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 28;
        const lastCycle = cycles[cycles.length - 1];
        const lastCycleStart = new Date(lastCycle.startDate + 'T00:00:00');
        const nextPeriodDateStr = aiPrediction?.date || getISODateString(addDays(lastCycleStart, avgCycle));
        const nextPeriodDate = new Date(nextPeriodDateStr + 'T00:00:00');
        const ovulationDate = addDays(nextPeriodDate, -14);
        const fertileStart = addDays(ovulationDate, -5);
        const fertileEnd = addDays(ovulationDate, 1);
        const diffTime = today.getTime() - lastCycleStart.getTime();
        const currentCycleDay = Math.max(1, Math.floor(diffTime / 86400000) + 1);
        let currentPhase = 'Follicular';
        let conceivingChance = 'Low';
        if (currentCycleDay <= (lastCycle.length || 5)) currentPhase = 'Menstrual';
        else if (currentCycleDay >= avgCycle - 12) currentPhase = 'Luteal';
        const isFertile = today >= fertileStart && today <= fertileEnd;
        if (isFertile) {
            currentPhase = getISODateString(today) === getISODateString(ovulationDate) ? 'Ovulation' : 'Follicular (Fertile)';
            conceivingChance = getISODateString(today) === getISODateString(ovulationDate) ? 'Peak' : 'High';
        }
        return { currentCycleDay, currentPhase, nextPeriod: nextPeriodDateStr, isFertile, avgCycle, conceivingChance };
    }, [cycles, dayLogs, aiPrediction]);

    const handleSaveEntry = () => {
        const updatedLogs = { 
            ...dayLogs, 
            [logDate]: { 
                flow: logFlow, symptoms: logSymptoms, notes: logNotes
            } 
        };
        setDayLogs(updatedLogs);
        const detectedCycles = detectCyclesFromLogs(updatedLogs);
        if (JSON.stringify(detectedCycles) !== JSON.stringify(cycles)) onUpdateCycles(detectedCycles);
        if ('vibrate' in navigator) navigator.vibrate(20);
    };
    
    const toggleSymptom = (symptomName: string) => {
        setLogSymptoms(prev => prev.includes(symptomName) ? prev.filter(s => s !== symptomName) : [...prev, symptomName]);
    };

    const PhaseIcon = { Menstrual: MenstrualPhaseIcon, Follicular: FollicularPhaseIcon, Ovulation: OvulationPhaseIcon, Luteal: LutealPhaseIcon }[insights.currentPhase.split(' ')[0]] || FollicularPhaseIcon;

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-2xl mx-auto px-1">
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Body Rituals</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1 italic">Personalized AI cycle intelligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg p-8 border border-pink-50 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2">Cycle Day</p>
                    <p className="text-5xl font-bold font-serif text-[#E18AAA] dark:text-pink-400">{insights.currentCycleDay}</p>
                    <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-pink-50 dark:bg-pink-900/20 rounded-full">
                        <PhaseIcon className="w-4 h-4 text-[#E18AAA]" />
                        <span className="text-[10px] font-bold font-sans text-[#E18AAA] uppercase tracking-wider">{insights.currentPhase}</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] shadow-lg p-8 text-white relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><SparklesIcon className="w-12 h-12" /></div>
                    <div>
                        <p className="text-[10px] font-bold font-sans text-white/80 uppercase tracking-widest mb-2">Nara Intelligence</p>
                        <h3 className="text-2xl font-bold font-serif mb-1">Next Period</h3>
                        <p className="text-xl font-bold text-white/90">
                            {aiPrediction ? new Date(aiPrediction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Calculating...'}
                        </p>
                    </div>
                    {aiPrediction && (
                         <div className="mt-4 pt-4 border-t border-white/20">
                             <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-100/60 mb-1">Empowerment Tip</p>
                             <p className="text-xs font-medium leading-relaxed italic">"{aiPrediction.tip}"</p>
                         </div>
                    )}
                </div>
            </div>

            {/* AI Pattern Recognition Card */}
            {(symptomInsight || isAiLoading) && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-[2.5rem] p-8 shadow-xl border border-indigo-100 dark:border-indigo-900/50 relative z-10 overflow-hidden">
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-indigo-500"><BrainIcon className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-lg font-bold font-serif text-indigo-900 dark:text-indigo-100">Cycle Pattern Analysis</h3>
                            <p className="text-[10px] font-bold font-sans text-indigo-400 uppercase tracking-widest">Nara AI Observations</p>
                        </div>
                    </div>
                    {isAiLoading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-indigo-100 dark:bg-indigo-900/40 rounded w-3/4"></div>
                            <div className="h-4 bg-indigo-100 dark:bg-indigo-900/40 rounded w-full"></div>
                        </div>
                    ) : (
                        <p className="text-sm font-sans text-indigo-800 dark:text-indigo-200 leading-relaxed italic">“{symptomInsight}”</p>
                    )}
                </div>
            )}

            {/* Symptom Forecast Card */}
            {aiPrediction?.forecast && (
                 <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-md border-l-4 border-emerald-400">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold font-sans uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Next 3 Days Symptom Forecast</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300 font-sans leading-relaxed">{aiPrediction.forecast}</p>
                 </div>
            )}

            <PeriodCalendar 
                calendarDate={calendarDate} setCalendarDate={setCalendarDate}
                dayLogs={dayLogs} cycles={cycles} insights={insights}
                onDateSelect={handleDateSelect} selectedDate={logDate}
            />

            <div ref={logFormRef} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl p-8 border-t-[6px] border-[#E18AAA]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-200">Daily Log</h3>
                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest">{new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Period Flow</label>
                        <div className="grid grid-cols-4 gap-2">
                            {flowTypes.map(flow => (
                                <button key={flow} onClick={() => setLogFlow(f => f === flow ? null : flow)} className={`py-4 rounded-2xl text-[10px] font-bold font-sans border-2 transition-all ${logFlow === flow ? 'bg-pink-50 border-[#E18AAA] text-[#E18AAA] shadow-md' : 'bg-gray-50 border-transparent text-gray-400 dark:bg-slate-700'}`}>{flow}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Physical Symptoms</label>
                        <div className="flex flex-wrap gap-2">
                            {symptomsList.map(symptom => (
                                <button key={symptom} onClick={() => toggleSymptom(symptom)} className={`px-4 py-2 rounded-full text-[10px] font-bold font-sans border-2 transition-all ${logSymptoms.includes(symptom) ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50 border-transparent text-gray-400 dark:bg-slate-700'}`}>{symptom}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSaveEntry} className="w-full bg-[#E18AAA] hover:bg-pink-600 text-white font-bold font-sans py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"><CheckIcon className="w-5 h-5" /> Commit Entry</button>
                </div>
            </div>
        </div>
    );
};

export default PeriodTrackerScreen;
