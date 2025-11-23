
import React, { useState, useMemo, useEffect } from 'react';
import { Cycle, DayLog, PeriodFlow, Habit } from '../types';
import { 
    WarningIcon, MenstrualPhaseIcon, FollicularPhaseIcon, OvulationPhaseIcon, LutealPhaseIcon, AddIcon, CheckIcon,
    DzikirIcon, MurajaahIcon, DuaIcon, ListenIcon,
    GentleExerciseIcon, SupplementIcon, WaterDropIcon, AppleIcon, MoonIcon, SparklesIcon
} from './icons';

// --- UTILITY FUNCTIONS ---
// Fix: Use local timezone to ensure user sees "today" correctly relative to their device
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
const flowTypes: PeriodFlow[] = ['Light', 'Medium', 'Heavy'];

const mucusTypes = ['Dry', 'Sticky', 'Creamy', 'Watery', 'Eggwhite'];
const positionTypes = ['Low', 'Medium', 'High'];
const energyLevels = ['Low', 'Medium', 'High'];
const moodTypes = ['Happy', 'Neutral', 'Sad', 'Anxious', 'Irritable', 'Calm'];
const periodColors = [
    { name: 'Black', color: '#2D2D2D' },
    { name: 'Brown', color: '#5D4037' },
    { name: 'Dark Red', color: '#8B0000' },
    { name: 'Bright Red', color: '#FF0000' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Gray', color: '#808080' },
];

const spiritualSuggestions = [
    { name: 'Make Dzikir', description: 'Recite Subhanallah, Alhamdulillah, Allahu Akbar.', icon: DzikirIcon, habitIcon: 'Meditation' },
    { name: 'Muraja\'ah', description: 'Review memorized Quran (without touching Mushaf).', icon: MurajaahIcon, habitIcon: 'Reading' },
    { name: 'Listen to Quran', description: 'Listening to recitation is highly rewarded.', icon: ListenIcon, habitIcon: 'Study' },
    { name: 'Make Du\'a', description: 'Take time for personal supplications.', icon: DuaIcon, habitIcon: 'Creative' },
];

const physicalSuggestions = [
    { name: 'Stay Hydrated', description: 'Drink plenty of water throughout the day.', icon: WaterDropIcon, habitIcon: 'Water' },
    { name: 'Eat Iron-Rich Foods', description: 'Consume spinach, lentils, or red meat.', icon: AppleIcon, habitIcon: 'Eating' },
    { name: 'Gentle Exercise', description: 'Try light walking, stretching, or yoga.', icon: GentleExerciseIcon, habitIcon: 'Exercise' },
    { name: 'Take Supplements', description: 'Consider magnesium for cramps or iron for energy.', icon: SupplementIcon, habitIcon: 'Creative' },
];

// --- ALGORITHMS ---
const detectCyclesFromLogs = (logs: Record<string, DayLog>): Cycle[] => {
    // 1. Get all dates with flow, sorted ascending
    const flowDates = Object.keys(logs)
        .filter(date => logs[date].flow !== null && ['Light', 'Medium', 'Heavy'].includes(logs[date].flow!))
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
            // Gap > 5 days usually implies a new cycle start
             const length = Math.ceil((new Date(currentEnd).getTime() - new Date(currentStart).getTime()) / (1000 * 3600 * 24)) + 1;
             detectedCycles.push({
                 id: currentStart, // Use start date as ID for simplicity
                 startDate: currentStart,
                 length: length
             });
             currentStart = flowDates[i];
        }
        currentEnd = flowDates[i];
    }

    // Add the last/current cycle
    const length = Math.ceil((new Date(currentEnd).getTime() - new Date(currentStart).getTime()) / (1000 * 3600 * 24)) + 1;
    detectedCycles.push({
        id: currentStart,
        startDate: currentStart,
        length: length
    });

    return detectedCycles;
};

// --- COMPONENT PROPS ---
interface PeriodTrackerProps {
    cycles: Cycle[];
    onUpdateCycles: (cycles: Cycle[]) => void;
    dayLogs: Record<string, DayLog>;
    setDayLogs: (logs: Record<string, DayLog>) => void;
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
}

const PeriodCalendar: React.FC<{
    calendarDate: Date;
    setCalendarDate: (date: Date) => void;
    dayLogs: Record<string, DayLog>;
    cycles: Cycle[];
    insights: any;
    onDateSelect: (dateStr: string) => void;
}> = ({ calendarDate, setCalendarDate, dayLogs, cycles, insights, onDateSelect }) => {
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });
    const year = calendarDate.getFullYear();

    const daysInMonth = new Date(year, calendarDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, calendarDate.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        setCalendarDate(new Date(year, calendarDate.getMonth() + offset, 1));
    };

    // Calculate future events relative to the displayed month
    const predictions = useMemo(() => {
        const events = new Map<string, string>(); // dateStr -> type
        if(cycles.length === 0) return events;

        const avgCycleLen = insights.avgCycle || 28;
        const lastCycleStart = new Date(cycles[cycles.length - 1].startDate);
        const lastCycleLen = cycles[cycles.length - 1].length || 5;

        // Start predicting from the last known cycle
        let predictedStart = new Date(lastCycleStart);
        
        // Project forward enough times to cover the calendar view year
        // Loop limit to prevent infinite loops (e.g. 2 years ahead)
        for(let i=0; i < 24; i++) {
             predictedStart = addDays(predictedStart, avgCycleLen);
             
             // If prediction is way past the calendar view, break optimization
             if (predictedStart.getFullYear() > year + 1) break;

             // Only add if it falls within relevant range (broadly)
             const predictedEnd = addDays(predictedStart, lastCycleLen - 1);
             const ovulation = addDays(predictedStart, -14);
             const fertileStart = addDays(ovulation, -5);
             const fertileEnd = addDays(ovulation, 1);

             // Helper to mark date
             const markDate = (d: Date, type: string) => {
                 const s = getISODateString(d);
                 if(!events.has(s) || (type === 'period' && events.get(s) !== 'period')) {
                    events.set(s, type);
                 }
             }

             // Mark Period
             for(let d = 0; d < lastCycleLen; d++) {
                 markDate(addDays(predictedStart, d), 'predicted-period');
             }
             // Mark Fertile Window
             for(let d = 0; d <= 6; d++) {
                 const fDay = addDays(fertileStart, d);
                 // Don't overwrite period
                 if (!events.has(getISODateString(fDay))) {
                     markDate(fDay, 'fertile');
                 }
             }
             // Mark Ovulation
             markDate(ovulation, 'ovulation');
        }
        return events;
    }, [cycles, insights.avgCycle, year]);

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-full aspect-square"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, calendarDate.getMonth(), day);
        const dayKey = getISODateString(dayDate);
        const todayKey = getISODateString(new Date());

        const log = dayLogs[dayKey];
        const isPeriodDay = !!log?.flow;
        const predictionType = predictions.get(dayKey);
        const hasSymptoms = log?.symptoms && log.symptoms.length > 0;
        
        let dayClasses = "w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer relative";
        
        if (isPeriodDay) {
            dayClasses += " bg-pink-200 text-pink-800 dark:bg-pink-800/60 dark:text-pink-200 font-bold";
        } else if (predictionType === 'ovulation') {
            dayClasses += " bg-yellow-200 text-yellow-800 dark:bg-yellow-500/40 dark:text-yellow-200 border-2 border-yellow-300 dark:border-yellow-600";
        } else if (predictionType === 'fertile') {
            dayClasses += " bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200";
        } else if (predictionType === 'predicted-period') {
             dayClasses += " bg-pink-50 text-pink-500 dashed-border dark:bg-pink-900/20 dark:text-pink-300";
        } else {
            dayClasses += " bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700";
        }
        
        if (dayKey === todayKey) dayClasses += " ring-2 ring-pink-500 z-10";

        calendarDays.push(
            <div key={day} className={dayClasses} onClick={() => onDateSelect(dayKey)}>
                {predictionType === 'ovulation' ? <OvulationPhaseIcon className="w-5 h-5"/> : <span>{day}</span>}
                {hasSymptoms && predictionType !== 'ovulation' && <div className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-gray-600 dark:text-slate-300">&lt;</button>
                <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-gray-600 dark:text-slate-300">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 dark:text-slate-400 font-semibold mb-2">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs dark:text-slate-300">
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5 bg-pink-200 dark:bg-pink-800/60"></span>Period</div>
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5 bg-pink-50 dark:bg-pink-900/40 border border-dashed border-pink-300"></span>Predicted</div>
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5 bg-green-100 dark:bg-green-800/40"></span>Fertile</div>
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full mr-1.5 bg-yellow-200 dark:bg-yellow-500/40 border border-yellow-400"></span>Ovulation</div>
                <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-indigo-400"></div>Symptom</div>
            </div>
            <style>{`
                .dashed-border {
                    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23F472B6' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
                }
                .dark .dashed-border {
                     background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23F472B680' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
                }
            `}</style>
        </div>
    );
};


// --- MAIN COMPONENT ---
const PeriodTrackerScreen: React.FC<PeriodTrackerProps> = ({ cycles, onUpdateCycles, dayLogs, setDayLogs, habits, setHabits }) => {
    // --- STATE FOR LOGGING FORM ---
    const [logDate, setLogDate] = useState(getISODateString(new Date()));
    const [logFlow, setLogFlow] = useState<PeriodFlow | null>(null);
    const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
    const [logNotes, setLogNotes] = useState('');
    
    // Advanced Tracking State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [logMucus, setLogMucus] = useState<DayLog['cervicalMucus']>(null);
    const [logTemp, setLogTemp] = useState<string>('');
    const [logPosition, setLogPosition] = useState<DayLog['cervicalPosition']>(null);
    const [logEnergy, setLogEnergy] = useState<DayLog['energyLevel']>(null);
    const [logMood, setLogMood] = useState<DayLog['mood']>(null);
    const [logPeriodColor, setLogPeriodColor] = useState<DayLog['periodColor']>(null);

    const [addedHabits, setAddedHabits] = useState<string[]>([]);
    const [calendarDate, setCalendarDate] = useState(new Date());


    useEffect(() => {
        const currentLog = dayLogs[logDate] || { flow: null, symptoms: [], notes: '' };
        setLogFlow(currentLog.flow || null);
        setLogSymptoms(currentLog.symptoms || []);
        setLogNotes(currentLog.notes || '');
        setLogMucus(currentLog.cervicalMucus || null);
        setLogTemp(currentLog.basalBodyTemp || '');
        setLogPosition(currentLog.cervicalPosition || null);
        setLogEnergy(currentLog.energyLevel || null);
        setLogMood(currentLog.mood || null);
        setLogPeriodColor(currentLog.periodColor || null);
    }, [logDate, dayLogs]);

    // --- DERIVED DATA & PREDICTIONS ---
    const insights = useMemo(() => {
        const today = new Date();
        const todayStr = getISODateString(today);
        
        if (cycles.length === 0) {
            return {
                currentCycleDay: 1, currentPhase: 'Follicular', nextPeriod: 'N/A',
                isFertile: false, fertileWindowStr: '', avgCycle: 28, predictionConfidence: 0,
                ovulationDay: 14, topSymptom: 'None',
                fertileWindowStart: null, fertileWindowEnd: null, ovulationDate: null,
                predictedPeriodStart: null, predictedPeriodEnd: null,
                forecast: [],
            };
        }

        const cycleLengths = cycles.length > 1 ? cycles.slice(1).map((c, i) => (new Date(c.startDate).getTime() - new Date(cycles[i].startDate).getTime()) / 86400000) : [];
        const avgCycle = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 28;
        
        let predictionConfidence;
        if (cycles.length <= 1) {
            predictionConfidence = 50;
        } else {
            const mean = avgCycle;
            const variance = cycleLengths.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / cycleLengths.length;
            const stdDev = Math.sqrt(variance);
            predictionConfidence = Math.max(50, Math.round(99 - stdDev * 4));
        }

        const lastCycle = cycles[cycles.length - 1];
        const lastCycleStart = new Date(lastCycle.startDate + 'T00:00:00');
        const lastCycleLen = lastCycle.length || 5;
        
        const nextPeriodDate = addDays(lastCycleStart, avgCycle);
        const predictedPeriodEnd = addDays(nextPeriodDate, lastCycleLen -1);
        const ovulationDate = addDays(nextPeriodDate, -14);
        const fertileStart = addDays(ovulationDate, -5);
        const fertileEnd = addDays(ovulationDate, 1);

        const currentCycleDay = Math.floor((today.getTime() - lastCycleStart.getTime()) / 86400000) + 1;
        
        // Phase Determination Logic
        let currentPhase = 'Follicular';
        
        // Check actual day log first
        const todayLog = dayLogs[todayStr];
        const isBleedingToday = todayLog?.flow && ['Light', 'Medium', 'Heavy'].includes(todayLog.flow);

        if (isBleedingToday) {
            currentPhase = 'Menstrual';
        } else {
            // Fallback to predictive logic if no data logged
            if (currentCycleDay <= lastCycleLen) currentPhase = 'Menstrual';
            else if (currentCycleDay >= avgCycle - 10) currentPhase = 'Luteal';
            
            if (getISODateString(today) >= getISODateString(fertileStart) && getISODateString(today) <= getISODateString(fertileEnd)) {
                if(getISODateString(today) === getISODateString(ovulationDate)) currentPhase = 'Ovulation';
            }
        }

        const topSymptom = Object.values(dayLogs).flatMap((log: DayLog) => log.symptoms)
            .reduce((acc, symptom) => {
                acc[symptom] = (acc[symptom] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const mostFrequentSymptom = Object.keys(topSymptom).length > 0
            ? Object.entries(topSymptom).sort((a, b) => b[1] - a[1])[0][0]
            : 'None';

        // Forecast future cycles
        const forecast = [];
        let tempDate = nextPeriodDate;
        for (let i = 0; i < 3; i++) {
             forecast.push({
                 startDate: new Date(tempDate),
                 endDate: addDays(tempDate, lastCycleLen - 1)
             });
             tempDate = addDays(tempDate, avgCycle);
        }

        return {
            currentCycleDay,
            currentPhase,
            nextPeriod: nextPeriodDate.toISOString().split('T')[0],
            isFertile: today >= fertileStart && today <= fertileEnd,
            fertileWindowStr: `${fertileStart.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${fertileEnd.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`,
            avgCycle,
            predictionConfidence,
            ovulationDay: avgCycle - 14,
            topSymptom: mostFrequentSymptom,
            // for calendar
            fertileWindowStart: fertileStart,
            fertileWindowEnd: fertileEnd,
            ovulationDate: ovulationDate,
            predictedPeriodStart: nextPeriodDate,
            predictedPeriodEnd: predictedPeriodEnd,
            forecast
        };
    }, [cycles, dayLogs]);

    // --- FORM HANDLERS ---
    const handleSaveEntry = () => {
        const newLog: DayLog = { 
            flow: logFlow, 
            symptoms: logSymptoms, 
            notes: logNotes,
            cervicalMucus: logMucus,
            basalBodyTemp: logTemp,
            cervicalPosition: logPosition,
            energyLevel: logEnergy,
            mood: logMood,
            periodColor: logPeriodColor
        };
        const updatedLogs = { ...dayLogs, [logDate]: newLog };
        setDayLogs(updatedLogs);

        // Auto-detect and update cycles based on the new log
        // This ensures the tracker stays robust and self-correcting
        const detectedCycles = detectCyclesFromLogs(updatedLogs);
        
        // Simple check to prevent unnecessary updates if count hasn't changed (though deep check is better)
        if (detectedCycles.length !== cycles.length || detectedCycles[detectedCycles.length-1].id !== cycles[cycles.length-1]?.id) {
             onUpdateCycles(detectedCycles);
        } else {
             // If cycle count is same, check if last cycle start date changed (e.g. user edited start of current cycle)
             const lastDetected = detectedCycles[detectedCycles.length - 1];
             const lastCurrent = cycles[cycles.length - 1];
             if (lastDetected.startDate !== lastCurrent.startDate) {
                 onUpdateCycles(detectedCycles);
             }
        }
        
        if ('vibrate' in navigator) navigator.vibrate(50);
    };
    
    const handleCancelEntry = () => {
        const currentLog = dayLogs[logDate] || { flow: null, symptoms: [], notes: '' };
        setLogFlow(currentLog.flow || null);
        setLogSymptoms(currentLog.symptoms || []);
        setLogNotes(currentLog.notes || '');
        setLogMucus(currentLog.cervicalMucus || null);
        setLogTemp(currentLog.basalBodyTemp || '');
        setLogPosition(currentLog.cervicalPosition || null);
        setLogEnergy(currentLog.energyLevel || null);
        setLogMood(currentLog.mood || null);
        setLogPeriodColor(currentLog.periodColor || null);
    };
    
    const toggleSymptom = (symptomName: string) => {
        setLogSymptoms(prev => 
            prev.includes(symptomName) 
                ? prev.filter(s => s !== symptomName)
                : [...prev, symptomName]
        );
    };

    const handleAddSuggestionAsHabit = (suggestion: { name: string, habitIcon: string }) => {
        const habitExists = habits.some(h => h.name === suggestion.name);
        if (habitExists) {
            return;
        }

        const newHabit: Habit = {
            id: new Date().toISOString(),
            name: suggestion.name,
            completed: false,
            streak: 0,
            icon: suggestion.habitIcon,
            color: '#A7D7C5' // A nice default color
        };
        setHabits([...habits, newHabit]);
        setAddedHabits(prev => [...prev, suggestion.name]);
    };

    // --- SUB-COMPONENTS ---
    const PhaseIcon = {
        Menstrual: MenstrualPhaseIcon,
        Follicular: FollicularPhaseIcon,
        Ovulation: OvulationPhaseIcon,
        Luteal: LutealPhaseIcon,
    }[insights.currentPhase] || FollicularPhaseIcon;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>Period Tracker</h2>
                <p className="text-[#8D7F85] dark:text-slate-400">Monitor your cycle and understand your body</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-around items-center gap-4">
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-bold">Cycle Day</p>
                    <p className="text-4xl font-bold text-[#E18AAA] dark:text-pink-400 mt-1">{insights.currentCycleDay}</p>
                </div>
                <div className="h-px sm:h-12 w-full sm:w-px bg-gray-200 dark:bg-slate-700"></div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-bold">Current Phase</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <PhaseIcon className="w-6 h-6 text-[#A7D7C5]" />
                        <p className="text-xl font-semibold text-gray-700 dark:text-slate-200">{insights.currentPhase}</p>
                    </div>
                </div>
                <div className="h-px sm:h-12 w-full sm:w-px bg-gray-200 dark:bg-slate-700"></div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-bold">Next Period</p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-slate-200 mt-1">{new Date(insights.nextPeriod).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
            </div>

            {insights.isFertile && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                         <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">High Fertility Window</p>
                        <p className="text-sm opacity-90">You are in your fertile window ({insights.fertileWindowStr}). Confidence: {insights.predictionConfidence}%.</p>
                    </div>
                </div>
            )}
            
            <PeriodCalendar 
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                dayLogs={dayLogs}
                cycles={cycles}
                insights={insights}
                onDateSelect={setLogDate}
            />

            {/* Future Forecast List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                 <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4 text-lg border-b border-gray-100 dark:border-slate-700 pb-2">Upcoming Cycles</h3>
                 <div className="space-y-3">
                     {insights.forecast.map((cycle, i) => (
                         <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 font-bold text-sm">
                                     {i + 1}
                                 </div>
                                 <div>
                                     <p className="font-semibold text-gray-700 dark:text-slate-200">Period {i + 1}</p>
                                     <p className="text-xs text-gray-500 dark:text-slate-400">Based on {insights.avgCycle}-day avg</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-gray-700 dark:text-slate-300">
                                     {cycle.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                 </p>
                                 <p className="text-xs text-gray-500 dark:text-slate-400">
                                     - {cycle.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>


            {insights.currentPhase === 'Menstrual' && (
                <div className="space-y-6 animate-list-item">
                     {/* Islamic Guidance Card - ENHANCED & EXPLICIT */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-emerald-100 dark:border-emerald-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-300">
                                <MoonIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">Islamic Insights & Guidance</h3>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">Spiritual support during your cycle</p>
                            </div>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 mb-6 italic text-emerald-800 dark:text-emerald-200 text-sm border-l-4 border-emerald-400">
                            "Menstruation is a decree from Allah. Use this time to rest and engage in remembrance (Dhikr) and supplication (Du'a)."
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Permissible Acts */}
                            <div>
                                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <CheckIcon className="w-4 h-4" /> Permissible (Ibadah)
                                </h4>
                                <div className="space-y-3">
                                    {spiritualSuggestions.map(suggestion => {
                                        const isAdded = habits.some(h => h.name === suggestion.name) || addedHabits.includes(suggestion.name);
                                        return (
                                        <div key={suggestion.name} className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-500">
                                                <suggestion.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{suggestion.name}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{suggestion.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddSuggestionAsHabit(suggestion)}
                                                disabled={isAdded}
                                                className={`p-1.5 rounded-full transition ${isAdded ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
                                                title={isAdded ? "Added to habits" : "Add to habits"}
                                            >
                                                {isAdded ? <CheckIcon className="w-4 h-4" /> : <AddIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Paused Acts - Explicitly Listed */}
                            <div>
                                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <WarningIcon className="w-4 h-4" /> Paused Obligations
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-red-50 dark:border-red-900/10">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span><strong>Salah (Prayer):</strong> Paused. You are exempted, and no make-up is required.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span><strong>Sawm (Fasting):</strong> Paused. You must make up missed mandatory fasts later.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span><strong>Tawaf (Circumambulation):</strong> Delayed until purification.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                     <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4 text-lg">Physical Wellness</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {physicalSuggestions.map(suggestion => {
                                const isAdded = habits.some(h => h.name === suggestion.name) || addedHabits.includes(suggestion.name);
                                return (
                                <div key={suggestion.name} className="flex items-center gap-4 bg-cyan-50 dark:bg-cyan-900/40 p-4 rounded-xl">
                                    <suggestion.icon className="w-8 h-8 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-cyan-800 dark:text-cyan-200">{suggestion.name}</p>
                                        <p className="text-xs text-cyan-600 dark:text-cyan-300">{suggestion.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddSuggestionAsHabit(suggestion)}
                                        disabled={isAdded}
                                        className="p-2 rounded-full bg-white dark:bg-slate-700 hover:bg-cyan-100 dark:hover:bg-slate-600 disabled:bg-cyan-200 dark:disabled:bg-cyan-800/50 disabled:cursor-not-allowed transition"
                                        aria-label={isAdded ? `Habit ${suggestion.name} added` : `Add ${suggestion.name} as a habit`}
                                    >
                                        {isAdded ? <CheckIcon className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> : <AddIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-300" />}
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}


            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4 text-center text-lg">Cycle Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-gray-700 dark:text-slate-200">{insights.avgCycle}</p><p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase mt-1">Avg Length</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-gray-700 dark:text-slate-200">{insights.predictionConfidence}%</p><p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase mt-1">Confidence</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-gray-700 dark:text-slate-200">{insights.ovulationDay}</p><p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase mt-1">Ovulation Day</p></div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"><p className="text-2xl font-bold text-gray-700 dark:text-slate-200 truncate px-1">{insights.topSymptom}</p><p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase mt-1">Top Symptom</p></div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-l-4 border-[#E18AAA]">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-4 text-lg">Log Entry for {new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                <div className="space-y-6">
                    <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm uppercase tracking-wide">Date</label>
                        <input 
                            type="date" 
                            value={logDate}
                            onChange={(e) => setLogDate(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] transition dark:text-slate-200"
                        />
                    </div>

                    <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm uppercase tracking-wide">Flow Intensity</label>
                        <div className="grid grid-cols-3 gap-3">
                            {flowTypes.map(flow => (
                                <button key={flow} onClick={() => setLogFlow(f => f === flow ? null : flow)} className={`py-3 px-3 rounded-xl text-sm font-bold border-2 transition-all ${logFlow === flow ? 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/60 dark:text-pink-200 dark:border-pink-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-pink-200 hover:bg-white dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:border-pink-500'}`}>
                                    {flow}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm uppercase tracking-wide">Symptoms</label>
                        <div className="grid grid-cols-4 gap-2">
                            {symptomsList.map(symptom => (
                                <button key={symptom} onClick={() => toggleSymptom(symptom)} className={`py-2 px-1 text-center rounded-lg border transition-colors text-xs font-semibold ${logSymptoms.includes(symptom) ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200 dark:border-indigo-700 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:border-indigo-500'}`}>
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                        <button 
                            onClick={() => setShowAdvanced(!showAdvanced)} 
                            className="text-pink-500 dark:text-pink-400 font-semibold text-sm hover:underline"
                        >
                            {showAdvanced ? "Hide Advanced Tracking" : "Show Advanced Tracking"}
                        </button>
                        
                        {showAdvanced && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm flex items-center gap-1">💧 Cervical Mucus</label>
                                        <div className="flex flex-wrap gap-2">
                                            {mucusTypes.map(m => (
                                                <button key={m} onClick={() => setLogMucus(m === logMucus ? null : m as any)} className={`px-2 py-1 text-xs rounded border ${logMucus === m ? 'bg-pink-200 border-pink-300 dark:bg-pink-800 dark:border-pink-600' : 'bg-white border-gray-200 dark:bg-slate-600 dark:border-slate-500'}`}>
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm flex items-center gap-1">🌡️ Basal Body Temp (C)</label>
                                        <input type="number" step="0.1" value={logTemp} onChange={e => setLogTemp(e.target.value)} placeholder="36.5" className="w-full p-2 text-sm border border-gray-200 rounded-lg dark:bg-slate-600 dark:border-slate-500 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm flex items-center gap-1">♡ Cervical Position</label>
                                         <div className="flex flex-wrap gap-2">
                                            {positionTypes.map(p => (
                                                <button key={p} onClick={() => setLogPosition(p === logPosition ? null : p as any)} className={`px-3 py-1 text-xs rounded border ${logPosition === p ? 'bg-pink-200 border-pink-300 dark:bg-pink-800 dark:border-pink-600' : 'bg-white border-gray-200 dark:bg-slate-600 dark:border-slate-500'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm">Energy Level</label>
                                         <div className="flex flex-wrap gap-2">
                                            {energyLevels.map(e => (
                                                <button key={e} onClick={() => setLogEnergy(e === logEnergy ? null : e as any)} className={`px-3 py-1 text-xs rounded border ${logEnergy === e ? 'bg-pink-200 border-pink-300 dark:bg-pink-800 dark:border-pink-600' : 'bg-white border-gray-200 dark:bg-slate-600 dark:border-slate-500'}`}>
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm">Mood</label>
                                    <div className="flex flex-wrap gap-2">
                                        {moodTypes.map(m => (
                                            <button key={m} onClick={() => setLogMood(m === logMood ? null : m as any)} className={`px-3 py-1 text-xs rounded border ${logMood === m ? 'bg-indigo-100 border-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-white border-gray-200 dark:bg-slate-600 dark:border-slate-500'}`}>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {logFlow && (
                                    <div>
                                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm">Period Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {periodColors.map(c => (
                                                <button 
                                                    key={c.name} 
                                                    onClick={() => setLogPeriodColor(c.name === logPeriodColor ? null : c.name as any)} 
                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${logPeriodColor === c.name ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-700 scale-110' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c.color }}
                                                    title={c.name}
                                                >
                                                    {logPeriodColor === c.name && <CheckIcon className="w-4 h-4 text-white drop-shadow-md" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                     <div>
                        <label className="font-bold text-gray-600 dark:text-slate-300 mb-2 block text-sm uppercase tracking-wide">Notes</label>
                        <textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="How are you feeling today?" rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] focus:border-transparent transition bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={handleCancelEntry} className="font-bold py-3 px-6 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-500 dark:text-slate-400">Cancel</button>
                        <button onClick={handleSaveEntry} className="bg-[#E18AAA] text-white font-bold py-3 px-8 rounded-xl hover:bg-pink-700 shadow-lg hover:shadow-xl transition transform active:scale-95">Save Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodTrackerScreen;
