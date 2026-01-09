import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Cycle, DayLog, PeriodFlow, Habit } from '../types';
import { 
    WarningIcon, MenstrualPhaseIcon, FollicularPhaseIcon, OvulationPhaseIcon, LutealPhaseIcon, AddIcon, CheckIcon,
    DzikirIcon, MurajaahIcon, DuaIcon, ListenIcon,
    GentleExerciseIcon, SupplementIcon, WaterDropIcon, AppleIcon, MoonIcon, SparklesIcon, GardenIcon, BackIcon, XMarkIcon, RestIcon,
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

const GENERAL_BODY_CARE = [
    { id: 'stretch', label: 'Gentle Stretching', icon: GentleExerciseIcon, detail: '5-min child\'s pose for back relief' },
    { id: 'water', label: 'Extra Hydration', icon: WaterDropIcon, detail: 'Drink 2L of warm water' },
    { id: 'heat', label: 'Heat Therapy', icon: RestIcon, detail: 'Use a warm compress for cramps' },
];

const SPIRITUAL_RITUALS = [
    { id: 'dhikr', label: 'Morning Adhkar', icon: DzikirIcon, detail: 'SubhanAllah, Alhamdulillah (33x)' },
    { id: 'listen', label: 'Listen & Reflect', icon: ListenIcon, detail: 'Engage with Quranic recitation' },
    { id: 'dua', label: 'Heartfelt Dua', icon: DuaIcon, detail: 'Personal conversation with the Creator' },
];

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
        // Predict for up to 6 months
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
    
    // Fixed: Corrected loop increment variable 'd' to 'day'
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

            <div className="mt-8 flex flex-col gap-4">
                <button onClick={() => setShowLegend(!showLegend)} className="text-[10px] font-bold font-sans uppercase tracking-widest text-gray-400 hover:text-[#E18AAA] transition-colors flex items-center gap-2 justify-center">
                    {showLegend ? 'Close Legend' : 'View Legend'}
                </button>
                
                {showLegend && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl animate-fade-in">
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg bg-[#E18AAA]"></div><span className="text-[10px] font-bold font-sans text-gray-600 dark:text-slate-400 uppercase tracking-tight">Logged Period</span></div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg bg-emerald-100 border border-emerald-200"></div><span className="text-[10px] font-bold font-sans text-gray-600 dark:text-slate-400 uppercase tracking-tight">Fertile Window</span></div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg bg-yellow-400"></div><span className="text-[10px] font-bold font-sans text-gray-600 dark:text-slate-400 uppercase tracking-tight">Ovulation Day</span></div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-lg border-2 border-dashed border-pink-200 bg-pink-50"></div><span className="text-[10px] font-bold font-sans text-gray-600 dark:text-slate-400 uppercase tracking-tight">Predicted Period</span></div>
                    </div>
                )}
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
    
    // Advanced logs
    const [logMucus, setLogMucus] = useState<DayLog['cervicalMucus']>(null);
    const [logPosition, setLogPosition] = useState<DayLog['cervicalPosition']>(null);
    const [logBBT, setLogBBT] = useState('');
    const [logEnergy, setLogEnergy] = useState<DayLog['energyLevel']>(null);
    const [logColor, setLogColor] = useState<DayLog['periodColor']>(null);
    
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [completedActivities, setCompletedActivities] = useState<string[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    const [aiPrediction, setAiPrediction] = useState<{ date: string, tip: string } | null>(null);
    const [symptomInsight, setSymptomInsight] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const logFormRef = useRef<HTMLDivElement>(null);

    // Analyze symptom trends and phase correlations
    const symptomAnalysis = useMemo(() => {
        if (cycles.length === 0 || Object.keys(dayLogs).length === 0) return null;

        const phaseMap: Record<string, Record<string, number>> = {
            'Menstrual': {},
            'Follicular': {},
            'Ovulation': {},
            'Luteal': {}
        };

        const cycleLengths = cycles.length > 1 ? cycles.slice(1).map((c, i) => (new Date(c.startDate).getTime() - new Date(cycles[i].startDate).getTime()) / 86400000) : [];
        const avgCycle = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 28;

        // Fixed: Typed 'log' in the iteration to DayLog to resolve 'unknown' type errors
        Object.entries(dayLogs).forEach(([dateStr, entry]) => {
            const log = entry as DayLog;
            if (!log.symptoms || log.symptoms.length === 0) return;

            // Find the cycle this date belongs to
            const dateObj = new Date(dateStr + 'T00:00:00');
            const relevantCycle = [...cycles].reverse().find(c => new Date(c.startDate + 'T00:00:00') <= dateObj);
            
            if (!relevantCycle) return;

            const diffTime = dateObj.getTime() - new Date(relevantCycle.startDate + 'T00:00:00').getTime();
            const cycleDay = Math.max(1, Math.floor(diffTime / 86400000) + 1);

            let phase = 'Follicular';
            if (cycleDay <= relevantCycle.length) phase = 'Menstrual';
            else if (cycleDay >= avgCycle - 12) phase = 'Luteal';
            // Simple ovulation heuristic for analysis
            if (cycleDay >= avgCycle - 15 && cycleDay <= avgCycle - 13) phase = 'Ovulation';

            log.symptoms.forEach(s => {
                phaseMap[phase][s] = (phaseMap[phase][s] || 0) + 1;
            });
        });

        return phaseMap;
    }, [cycles, dayLogs]);

    const fetchAiInsights = async () => {
        if (cycles.length < 1) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // 1. Period Prediction
            const cycleContext = cycles.slice(-5).map(c => `Started: ${c.startDate}, Duration: ${c.length} days`).join('; ');
            const predictionPrompt = `Based on these cycle history logs: ${cycleContext}. 
            Current Date: ${getISODateString(new Date())}. 
            1. Predict the start date of the NEXT period (YYYY-MM-DD). 
            2. Provide 1 short, supportive wellness tip based on this cycle stage. 
            Format as JSON: {"date": "YYYY-MM-DD", "tip": "tip text"}.`;

            const predResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: predictionPrompt,
                config: { responseMimeType: 'application/json' }
            });
            const predResult = JSON.parse(predResponse.text || '{}');
            if (predResult.date) setAiPrediction(predResult);

            // 2. Symptom Trend Analysis
            if (symptomAnalysis) {
                const analysisSummary = Object.entries(symptomAnalysis)
                    .map(([phase, symptoms]) => `${phase}: ${Object.entries(symptoms).map(([s, count]) => `${s} (${count}x)`).join(', ')}`)
                    .join('; ');

                const insightPrompt = `I have logged these symptoms across cycle phases: ${analysisSummary}. 
                Analyze these patterns. Tell me ONE interesting trend you see (e.g., "You often report fatigue in your Luteal phase") and provide ONE deeply practical wellness advice linked to that pattern. 
                Keep it compassionate, succinct, and empowering. Max 40 words.`;

                const insightResponse = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: insightPrompt,
                    config: { maxOutputTokens: 150 }
                });
                if (insightResponse.text) setSymptomInsight(insightResponse.text.trim());
            }
        } catch (e) {
            console.error("AI Analysis Failed", e);
        } finally {
            setIsAiLoading(false);
        }
    };

    useEffect(() => {
        fetchAiInsights();
    }, [cycles]); // Re-run when cycles update, which implies new logs committed

    useEffect(() => {
        const currentLog = dayLogs[logDate] || { flow: null, symptoms: [], notes: '' };
        setLogFlow(currentLog.flow || null);
        setLogSymptoms(currentLog.symptoms || []);
        setLogNotes(currentLog.notes || '');
        setLogMucus(currentLog.cervicalMucus || null);
        setLogPosition(currentLog.cervicalPosition || null);
        setLogBBT(currentLog.basalBodyTemp || '');
        setLogEnergy(currentLog.energyLevel || null);
        setLogColor(currentLog.periodColor || null);
    }, [logDate, dayLogs]);

    const handleDateSelect = (dateStr: string) => {
        setLogDate(dateStr);
        logFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const toggleActivity = (id: string) => {
        setCompletedActivities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
        if (!completedActivities.includes(id)) {
            if ('vibrate' in navigator) navigator.vibrate(15);
        }
    };

    const insights = useMemo(() => {
        const today = new Date();
        const todayStr = getISODateString(today);
        
        if (cycles.length === 0) {
            return { currentCycleDay: 1, currentPhase: 'Follicular', nextPeriod: 'N/A', isFertile: false, avgCycle: 28, conceivingChance: 'Low' };
        }

        const cycleLengths = cycles.length > 1 ? cycles.slice(1).map((c, i) => (new Date(c.startDate).getTime() - new Date(cycles[i].startDate).getTime()) / 86400000) : [];
        const avgCycle = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 28;
        
        const lastCycle = cycles[cycles.length - 1];
        const lastCycleStart = new Date(lastCycle.startDate + 'T00:00:00');
        const nextPeriodDateArith = addDays(lastCycleStart, avgCycle);
        
        // Prefer AI Prediction if available
        const nextPeriodDateStr = aiPrediction?.date || getISODateString(nextPeriodDateArith);
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
                flow: logFlow, 
                symptoms: logSymptoms, 
                notes: logNotes,
                cervicalMucus: logMucus,
                cervicalPosition: logPosition,
                basalBodyTemp: logBBT,
                energyLevel: logEnergy,
                periodColor: logColor
            } 
        };
        setDayLogs(updatedLogs);
        const detectedCycles = detectCyclesFromLogs(updatedLogs);
        if (JSON.stringify(detectedCycles) !== JSON.stringify(cycles)) onUpdateCycles(detectedCycles);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };
    
    const toggleSymptom = (symptomName: string) => {
        setLogSymptoms(prev => prev.includes(symptomName) ? prev.filter(s => s !== symptomName) : [...prev, symptomName]);
    };

    const PhaseIcon = { Menstrual: MenstrualPhaseIcon, Follicular: FollicularPhaseIcon, Ovulation: OvulationPhaseIcon, Luteal: LutealPhaseIcon }[insights.currentPhase.split(' ')[0]] || FollicularPhaseIcon;

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Body Rituals</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">Nurturing your physical and spiritual cycle.</p>
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

                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] shadow-lg p-8 text-white relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div>
                        <p className="text-[10px] font-bold font-sans text-white/80 uppercase tracking-widest mb-2">Fertility Intelligence</p>
                        <h3 className="text-2xl font-bold font-serif mb-1">{insights.conceivingChance} Chance</h3>
                        <p className="text-xs font-medium text-white/70 leading-relaxed">
                            {insights.isFertile ? "High fertility window active." : "Low fertility status for today."}
                        </p>
                    </div>
                    {aiPrediction && (
                         <div className="mt-4 pt-4 border-t border-white/20">
                             <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100/60 mb-1">AI Prediction</p>
                             <p className="text-xs font-bold">Next period: {new Date(aiPrediction.date).toLocaleDateString()}</p>
                         </div>
                    )}
                </div>
            </div>

            {/* Pattern Discovery Section */}
            {symptomInsight && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-[2.5rem] p-8 shadow-xl border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-indigo-500">
                            <BrainIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-serif text-indigo-900 dark:text-indigo-100">Cycle Intelligence</h3>
                            <p className="text-[10px] font-bold font-sans text-indigo-400 uppercase tracking-widest">Personal Pattern Recognition</p>
                        </div>
                    </div>
                    
                    <p className="text-sm font-sans text-indigo-800 dark:text-indigo-200 leading-relaxed italic mb-6 relative z-10">
                        “{symptomInsight}”
                    </p>

                    <div className="flex flex-wrap gap-2 relative z-10">
                        {symptomAnalysis && Object.entries(symptomAnalysis).map(([phase, symptoms]) => {
                            const topSymptom = Object.entries(symptoms).sort((a,b) => b[1] - a[1])[0];
                            if (!topSymptom) return null;
                            return (
                                <div key={phase} className="px-3 py-1.5 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-600 flex items-center gap-2">
                                    <span className="text-[9px] font-bold font-sans text-indigo-400 uppercase">{phase}</span>
                                    <span className="text-[10px] font-bold text-gray-700 dark:text-slate-200">{topSymptom[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {aiPrediction?.tip && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-3xl flex items-start gap-3 animate-fade-in shadow-sm">
                    <SparklesIcon className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-sans text-indigo-900 dark:text-indigo-100 italic">“{aiPrediction.tip}”</p>
                </div>
            )}

            {/* Separated Period Activity Features */}
            {insights.currentPhase === 'Menstrual' && (
                <div className="space-y-4">
                    {/* General Body Care Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-pink-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-50 dark:bg-pink-900/40 rounded-2xl text-[#E18AAA]">
                                    <SparklesIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Body Care Rituals</h3>
                                    <p className="text-[10px] font-bold font-sans text-pink-400 uppercase tracking-widest">Self-Care Recommendations</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-0 space-y-3">
                            {GENERAL_BODY_CARE.map(activity => (
                                <button 
                                    key={activity.id} 
                                    onClick={() => toggleActivity(activity.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${completedActivities.includes(activity.id) ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20' : 'bg-gray-50 border-transparent dark:bg-slate-900/50'}`}
                                >
                                    <div className={`p-2 rounded-xl ${completedActivities.includes(activity.id) ? 'bg-white text-pink-500' : 'bg-white dark:bg-slate-700 text-gray-400'}`}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left flex-grow">
                                        <h4 className={`text-sm font-bold font-sans ${completedActivities.includes(activity.id) ? 'text-pink-700 line-through' : 'text-gray-800 dark:text-slate-100'}`}>{activity.label}</h4>
                                        <p className="text-[10px] text-gray-400">{activity.detail}</p>
                                    </div>
                                    {completedActivities.includes(activity.id) && <CheckIcon className="w-5 h-5 text-pink-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Islamic Guidance Card (Conditional) */}
                    {isIslamicGuidanceOn && (
                        <div className="bg-indigo-600 rounded-[2.5rem] shadow-xl border border-indigo-500 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="p-8 pb-4 relative z-10 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                        <MoonIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-serif">Sacred Rest Rituals</h3>
                                        <p className="text-[10px] font-bold font-sans text-indigo-200 uppercase tracking-widest">Islamic Spiritual Path</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-0 space-y-3 relative z-10">
                                {SPIRITUAL_RITUALS.map(ritual => (
                                    <button 
                                        key={ritual.id} 
                                        onClick={() => toggleActivity(ritual.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${completedActivities.includes(ritual.id) ? 'bg-white/20 border-white/40' : 'bg-black/10 border-transparent hover:bg-black/20'}`}
                                    >
                                        <div className={`p-2 rounded-xl ${completedActivities.includes(ritual.id) ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-indigo-100'}`}>
                                            <ritual.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-left flex-grow">
                                            <h4 className={`text-sm font-bold font-sans text-white ${completedActivities.includes(ritual.id) ? 'line-through opacity-80' : ''}`}>{ritual.label}</h4>
                                            <p className="text-[10px] text-indigo-100/70">{ritual.detail}</p>
                                        </div>
                                        {completedActivities.includes(ritual.id) && <CheckIcon className="w-5 h-5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <PeriodCalendar 
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                dayLogs={dayLogs}
                cycles={cycles}
                insights={insights}
                onDateSelect={handleDateSelect}
                selectedDate={logDate}
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
                                <button key={flow} onClick={() => setLogFlow(f => f === flow ? null : flow)} className={`py-4 rounded-2xl text-[10px] font-bold font-sans border-2 transition-all ${logFlow === flow ? 'bg-pink-50 border-[#E18AAA] text-[#E18AAA] shadow-md' : 'bg-gray-50 border-transparent text-gray-400 dark:bg-slate-700'}`}>
                                    {flow}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Physical Symptoms</label>
                        <div className="flex flex-wrap gap-2">
                            {symptomsList.map(symptom => (
                                <button key={symptom} onClick={() => toggleSymptom(symptom)} className={`px-4 py-2 rounded-full text-[10px] font-bold font-sans border-2 transition-all ${logSymptoms.includes(symptom) ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50 border-transparent text-gray-400 dark:bg-slate-700'}`}>
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                        <button 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex justify-between items-center py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400"
                        >
                            <span>Advanced Fertility Tracking</span>
                            <AddIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
                        </button>
                        
                        {showAdvanced && (
                            <div className="space-y-6 mt-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Cervical Mucus</label>
                                        <select value={logMucus || ''} onChange={e => setLogMucus(e.target.value as any || null)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs font-sans outline-none dark:text-slate-200 border border-transparent focus:border-indigo-200">
                                            <option value="">Not Tracked</option>
                                            <option value="Dry">Dry</option>
                                            <option value="Sticky">Sticky</option>
                                            <option value="Creamy">Creamy</option>
                                            <option value="Watery">Watery</option>
                                            <option value="Eggwhite">Eggwhite (Fertile)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Cervical Pos.</label>
                                        <select value={logPosition || ''} onChange={e => setLogPosition(e.target.value as any || null)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs font-sans outline-none dark:text-slate-200 border border-transparent focus:border-indigo-200">
                                            <option value="">Not Tracked</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High (Fertile)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Basal Temp (°C)</label>
                                        <input type="text" placeholder="e.g. 36.5" value={logBBT} onChange={e => setLogBBT(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs font-sans outline-none dark:text-slate-200 border border-transparent focus:border-indigo-200" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Energy Level</label>
                                        <select value={logEnergy || ''} onChange={e => setLogEnergy(e.target.value as any || null)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs font-sans outline-none dark:text-slate-200 border border-transparent focus:border-indigo-200">
                                            <option value="">Not Tracked</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>
                                {logFlow && (
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Period Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Bright Red', 'Dark Red', 'Brown', 'Pink', 'Gray'].map(c => (
                                                <button key={c} onClick={() => setLogColor(c as any)} className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase border-2 transition-all ${logColor === c ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-transparent bg-gray-50 dark:bg-slate-900 text-gray-400'}`}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Notes</label>
                        <textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="How do you feel today?" className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-sans text-sm resize-none h-24 dark:text-slate-200" />
                    </div>

                    <button onClick={handleSaveEntry} className="w-full bg-[#E18AAA] hover:bg-pink-600 text-white font-bold font-sans py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                        <CheckIcon className="w-5 h-5" /> Commit Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeriodTrackerScreen;