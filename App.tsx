
import React, { useState, useEffect, useMemo } from 'react';
import { DashboardIcon, MoodIcon, HabitIcon, JournalIcon, PeriodIcon, GardenIcon, SettingsIcon, AnaraLogo, UserIcon, PomegranateFruitIcon, SparklesIcon, MenuIcon } from './components/icons';
import HomeScreen from './components/HomeScreen'; // This is now the Dashboard
import MoodTrackerScreen from './components/MoodTrackerScreen';
import HabitTrackerScreen from './components/HabitTrackerScreen';
import JournalScreen from './components/JournalScreen';
import PeriodTrackerScreen from './components/PeriodTrackerScreen';
import GardenScreen from './components/GardenScreen';
import SettingsScreen from './components/SettingsScreen';
import SplashScreen from './components/SplashScreen';
import SignInScreen from './components/auth/SignInScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import { Tab, MoodEntry, Habit, JournalEntry, Cycle, DayLog, GardenDecor, User, HabitReminder, NotificationSetting } from './types';
import NaraFriend from './components/NaraFriend';

// --- UTILITY FUNCTIONS & DEFAULT DATA ---
// Fix: Use local timezone for date string to ensure "today" matches user's reality
const getISODateString = (date: Date): string => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

const calculateInsights = (cycles: Cycle[], dayLogs: Record<string, DayLog>) => {
    const today = new Date();
    if (cycles.length === 0) {
        return { nextPeriod: null, ovulationDate: null };
    }

    const cycleLengths = cycles.length > 1 ? cycles.slice(1).map((c, i) => (new Date(c.startDate).getTime() - new Date(cycles[i].startDate).getTime()) / 86400000) : [28];
    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) || 28;
    const lastCycle = cycles[cycles.length - 1];
    const lastCycleStart = new Date(lastCycle.startDate + 'T00:00:00');
    
    const nextPeriodDate = addDays(lastCycleStart, avgCycle);
    const ovulationDate = addDays(nextPeriodDate, -14);
    
    return {
        nextPeriod: nextPeriodDate,
        ovulationDate: ovulationDate,
    };
};


const defaultMoodHistory: MoodEntry[] = [
    { id: '1', mood: 'Happy', activities: ['Friends', 'Hobby'], note: 'Had a wonderful day with friends!', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: '2', mood: 'Calm', activities: ['Relax'], note: 'Spent some time reading a book.', date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: '3', mood: 'Grateful', activities: ['Work', 'Hobby'], note: 'Finished a big project!', date: new Date(new Date().setDate(new Date().getDate() - 4)) },
    { id: '4', mood: 'Happy', activities: ['Family'], note: 'Family dinner.', date: new Date(new Date().setDate(new Date().getDate() - 5)) },
];

const defaultHabits: Habit[] = [
    { id: '1', name: 'Daily Reading', completed: true, streak: 5, streakGoal: 14, icon: 'Reading', color: '#60A5FA' },
    { id: '2', name: 'Focus Study', completed: false, streak: 12, streakGoal: 30, icon: 'Study', color: '#818CF8' },
    { id: '3', name: 'Hydration', completed: false, streak: 28, streakGoal: 60, icon: 'Water', color: '#2DD4BF' },
    { id: '4', name: 'Yoga Flow', completed: false, streak: 3, streakGoal: 7, icon: 'Exercise', color: '#F472B6' },
];

const defaultJournalEntries: JournalEntry[] = [
     { id: '1', title: "A Fresh Start", content: 'Today felt like a fresh start. I am excited for what is to come.', date: new Date(Date.now() - 86400000 * 2), tags: ['new beginnings'], linkedMood: 'Grateful' },
];

const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 12);

const defaultCycles: Cycle[] = [
    { id: '1', startDate: getISODateString(twoMonthsAgo), length: 5 },
    { id: '2', startDate: getISODateString(lastMonth), length: 5 },
];

const defaultDayLogs: Record<string, DayLog> = {
    [getISODateString(lastMonth)]: { flow: 'Light', symptoms: ['Headache'] },
    [getISODateString(addDays(lastMonth, 1))]: { flow: 'Medium', symptoms: ['Cramps'] },
};

const defaultGardenDecor: GardenDecor = {
    activePot: 'Default',
    activeBackground: 'Sunrise',
};

const defaultHabitReminder: HabitReminder = {
    enabled: true,
    time: '09:00',
    habitsToRemind: ['1', '2'],
    frequency: 'Daily'
};

const defaultNotifications: Record<string, NotificationSetting> = {
    periodStart: { enabled: true, time: '09:00', daysBefore: 0, method: 'In-App' },
    ovulation: { enabled: true, time: '09:00', daysBefore: 1, method: 'In-App' },
    fertilityWindow: { enabled: false, time: '09:00', daysBefore: 2, method: 'In-App' },
    symptomReminder: { enabled: true, time: '20:00', daysBefore: 0, method: 'In-App' },
};


// Helper function to get initial user from localStorage
const getInitialUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem('anaraUser');
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('anaraUser'); // Clean up corrupted data
    }
    return null;
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [showSignUp, setShowSignUp] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
    const [isNaraFriendOpen, setIsNaraFriendOpen] = useState(false);

    // --- LIFTED STATE (WITH PERSISTENCE) ---
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
        try {
            const saved = localStorage.getItem('anaraMoodHistory');
            if (saved) {
                const parsed = JSON.parse(saved) as any[];
                return parsed.map(entry => ({ ...entry, date: new Date(entry.date) }));
            }
        } catch (e) { console.error("Failed to load mood history", e); }
        return defaultMoodHistory;
    });
    
    const [habits, setHabits] = useState<Habit[]>(() => {
        try {
            const saved = localStorage.getItem('anaraHabits');
            return saved ? JSON.parse(saved) : defaultHabits;
        } catch (e) { console.error("Failed to load habits", e); }
        return defaultHabits;
    });

    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
        try {
            const saved = localStorage.getItem('anaraJournalEntries');
            if (saved) {
                const parsed = JSON.parse(saved) as any[];
                // Migration logic: convert old 'media' object to 'attachments' array if needed
                return parsed.map(entry => ({ 
                    ...entry, 
                    date: new Date(entry.date),
                    attachments: entry.attachments || (entry.media ? [entry.media] : [])
                }));
            }
        } catch (e) { console.error("Failed to load journal entries", e); }
        return defaultJournalEntries;
    });
    
    const [cycles, setCycles] = useState<Cycle[]>(() => {
        try {
            const saved = localStorage.getItem('anaraCycles');
            return saved ? JSON.parse(saved) : defaultCycles;
        } catch (e) { console.error("Failed to load cycles", e); }
        return defaultCycles;
    });
    
    const [dayLogs, setDayLogs] = useState<Record<string, DayLog>>(() => {
        try {
            const saved = localStorage.getItem('anaraDayLogs');
            return saved ? JSON.parse(saved) : defaultDayLogs;
        } catch (e) { console.error("Failed to load day logs", e); }
        return defaultDayLogs;
    });

    const [gardenDecor, setGardenDecor] = useState<GardenDecor>(() => {
        try {
            const saved = localStorage.getItem('anaraGardenDecor');
            return saved ? JSON.parse(saved) : defaultGardenDecor;
        } catch (e) { console.error("Failed to load garden decor", e); }
        return defaultGardenDecor;
    });

    const [gardenXp, setGardenXp] = useState<number>(() => {
        try {
            const savedXp = localStorage.getItem('anaraGardenXp');
            if (savedXp !== null) {
                return JSON.parse(savedXp);
            }
            const savedHabits = localStorage.getItem('anaraHabits');
            const habitsToCalcFrom = savedHabits ? JSON.parse(savedHabits) : defaultHabits;
            return habitsToCalcFrom.reduce((sum: number, h: Habit) => sum + (h.streak || 0), 0);
        } catch (e) {
            console.error("Failed to load or calculate garden XP", e);
            return defaultHabits.reduce((sum, h) => sum + (h.streak || 0), 0);
        }
    });

     const [habitReminder, setHabitReminder] = useState<HabitReminder>(() => {
        try {
            const saved = localStorage.getItem('anaraHabitReminder');
            return saved ? JSON.parse(saved) : defaultHabitReminder;
        } catch (e) { console.error("Failed to load habit reminder", e); }
        return defaultHabitReminder;
    });
    
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('anaraIsDarkMode');
            if (saved !== null) return JSON.parse(saved);
            // Default to false (Light Mode) as requested for first-time users, ignoring system preference initially
            return false;
        } catch (e) {
            console.error("Failed to load dark mode setting", e);
            return false;
        }
    });

    const [notifications, setNotifications] = useState<Record<string, NotificationSetting>>(() => {
        try {
            const saved = localStorage.getItem('anaraNotifications');
            return saved ? JSON.parse(saved) : defaultNotifications;
        } catch (e) { return defaultNotifications; }
    });


    // --- STATE HANDLERS ---
    const handleAddMoodEntry = (newEntryData: Omit<MoodEntry, 'id' | 'date'>) => {
        const newEntry: MoodEntry = { ...newEntryData, id: new Date().toISOString(), date: new Date() };
        setMoodHistory(prev => [newEntry, ...prev]);
    };
    
    const handleSetHabits = (newHabits: Habit[]) => setHabits(newHabits);

    const handleToggleHabit = (habitId: string) => {
        let xpChange = 0;
        const newHabits = habits.map(habit => {
            if (habit.id === habitId) {
                const isNowCompleted = !habit.completed;
                if (isNowCompleted && 'vibrate' in navigator) {
                    navigator.vibrate(50);
                }
                
                let newStreak = habit.streak || 0;

                if (isNowCompleted) {
                    newStreak++;
                    xpChange = 1; // Gain 1 XP for each completion
                } else {
                    newStreak = Math.max(0, newStreak - 1); // Just decrement for today's undo, simple logic
                }

                return { ...habit, completed: isNowCompleted, streak: newStreak };
            }
            return habit;
        });
        
        setHabits(newHabits);
        setGardenXp(prevXp => prevXp + xpChange);
    };

    const handleSetJournalEntries = (newEntries: JournalEntry[]) => setJournalEntries(newEntries);
    const handleSetDayLogs = (newLogs: Record<string, DayLog>) => setDayLogs(newLogs);
    const handleSetGardenDecor = (newDecor: GardenDecor) => setGardenDecor(newDecor);
    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('anaraUser', JSON.stringify(updatedUser));
    };
    const handleSetHabitReminder = (newReminder: HabitReminder) => setHabitReminder(newReminder);
    const handleSetNotifications = (newNotifications: Record<string, NotificationSetting>) => setNotifications(newNotifications);


    // --- PERSISTENCE EFFECTS ---
    useEffect(() => { localStorage.setItem('anaraMoodHistory', JSON.stringify(moodHistory)); }, [moodHistory]);
    useEffect(() => { localStorage.setItem('anaraHabits', JSON.stringify(habits)); }, [habits]);
    useEffect(() => { localStorage.setItem('anaraJournalEntries', JSON.stringify(journalEntries)); }, [journalEntries]);
    useEffect(() => { localStorage.setItem('anaraCycles', JSON.stringify(cycles)); }, [cycles]);
    useEffect(() => { localStorage.setItem('anaraDayLogs', JSON.stringify(dayLogs)); }, [dayLogs]);
    useEffect(() => { localStorage.setItem('anaraGardenDecor', JSON.stringify(gardenDecor)); }, [gardenDecor]);
    useEffect(() => { localStorage.setItem('anaraGardenXp', JSON.stringify(gardenXp)); }, [gardenXp]);
    useEffect(() => { localStorage.setItem('anaraHabitReminder', JSON.stringify(habitReminder)); }, [habitReminder]);
    useEffect(() => { localStorage.setItem('anaraNotifications', JSON.stringify(notifications)); }, [notifications]);
    useEffect(() => {
        localStorage.setItem('anaraIsDarkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);


    // --- NOTIFICATION EFFECT ---
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const todayStr = getISODateString(now);

            // Get latest data from storage to ensure consistency
            const storedHabitsStr = localStorage.getItem('anaraHabits');
            const storedReminderStr = localStorage.getItem('anaraHabitReminder');
            const storedCyclesStr = localStorage.getItem('anaraCycles');
            const storedNotificationsStr = localStorage.getItem('anaraNotifications');

            // 1. Habit Reminders
            if (storedHabitsStr && storedReminderStr) {
                const reminder: HabitReminder = JSON.parse(storedReminderStr);
                if (reminder.enabled && currentTime === reminder.time) {
                    const currentHabits: Habit[] = JSON.parse(storedHabitsStr);
                    const day = now.getDay();
                    const isWeekday = day >= 1 && day <= 5;
                    const shouldNotifyToday = reminder.frequency === 'Daily' || (reminder.frequency === 'Weekdays' && isWeekday) || (reminder.frequency === 'Weekends' && !isWeekday);
                    
                    if (shouldNotifyToday) {
                        const uncompleted = currentHabits.filter(h => reminder.habitsToRemind.includes(h.id) && !h.completed);
                        if (uncompleted.length > 0) {
                            new Notification('Anara Habit Reminder', { body: `Time for your habits: ${uncompleted.map(h => h.name).join(', ')}`, icon: '/vite.svg' });
                        }
                    }
                }
            }

            // 2. Cycle Reminders
            if (storedCyclesStr && storedNotificationsStr) {
                const cycles: Cycle[] = JSON.parse(storedCyclesStr);
                const notifications: Record<string, NotificationSetting> = JSON.parse(storedNotificationsStr);
                const insights = calculateInsights(cycles, {}); // DayLogs not needed for these predictions

                // Period Start Notification
                const periodSetting = notifications.periodStart;
                if (periodSetting.enabled && insights.nextPeriod && currentTime === periodSetting.time) {
                    const reminderDate = addDays(insights.nextPeriod, -periodSetting.daysBefore);
                    if (getISODateString(reminderDate) === todayStr) {
                        new Notification('Anara: Period Reminder', { body: `Your period is predicted to start in ${periodSetting.daysBefore > 0 ? `${periodSetting.daysBefore} day(s)` : 'today'}.`, icon: '/vite.svg' });
                    }
                }

                // Ovulation Notification
                const ovulationSetting = notifications.ovulation;
                if (ovulationSetting.enabled && insights.ovulationDate && currentTime === ovulationSetting.time) {
                    const reminderDate = addDays(insights.ovulationDate, -ovulationSetting.daysBefore);
                    if (getISODateString(reminderDate) === todayStr) {
                         new Notification('Anara: Ovulation Reminder', { body: `Ovulation is predicted in ${ovulationSetting.daysBefore > 0 ? `${ovulationSetting.daysBefore} day(s)` : 'today'}.`, icon: '/vite.svg' });
                    }
                }
            }

        }, 60000); // Check every 60 seconds

        return () => clearInterval(intervalId);
    }, []);


    // --- RENDER LOGIC ---
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (email: string) => { 
        const name = email.split('@')[0].replace(/[^a-zA-Z]/g, '');
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const userData: User = { name: capitalizedName, email, profilePicture: null, isNewUser: false }; // Returning user
        setUser(userData); 
        localStorage.setItem('anaraUser', JSON.stringify(userData));
    };
    
    const handleSignUp = (name: string, email: string) => { 
        const userData: User = { name, email, profilePicture: null, isNewUser: true }; // New user
        setUser(userData); 
        localStorage.setItem('anaraUser', JSON.stringify(userData));
    };
    
    const handleLogout = () => { 
        setUser(null); 
        setActiveTab(Tab.Dashboard); 
        
        // Clear all user data from storage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('anara')) {
                localStorage.removeItem(key);
            }
        });

        // Reset state to defaults
        setMoodHistory(defaultMoodHistory);
        setHabits(defaultHabits);
        setJournalEntries(defaultJournalEntries);
        setCycles(defaultCycles);
        setDayLogs(defaultDayLogs);
        setGardenDecor(defaultGardenDecor);
        setGardenXp(defaultHabits.reduce((sum, h) => sum + (h.streak || 0), 0));
        setHabitReminder(defaultHabitReminder);
        setNotifications(defaultNotifications);
        setIsDarkMode(false); // Reset to Light Mode on logout
    };
    
    const renderScreen = () => {
        switch (activeTab) {
            case Tab.Dashboard:
                return <HomeScreen user={user} moodHistory={moodHistory} habits={habits} journalEntries={journalEntries} cycleData={{cycles, dayLogs}} onNavigate={setActiveTab} gardenXp={gardenXp} />;
            case Tab.Mood:
                return <MoodTrackerScreen moodHistory={moodHistory} onAddMoodEntry={handleAddMoodEntry} />;
            case Tab.Habit:
                return <HabitTrackerScreen habits={habits} setHabits={handleSetHabits} onToggleHabit={handleToggleHabit} />;
            case Tab.Journal:
                return <JournalScreen entries={journalEntries} setEntries={handleSetJournalEntries} />;
            case Tab.Period:
                return <PeriodTrackerScreen cycles={cycles} onUpdateCycles={setCycles} dayLogs={dayLogs} setDayLogs={handleSetDayLogs} habits={habits} setHabits={handleSetHabits} />;
            case Tab.Garden:
                return <GardenScreen habits={habits} gardenDecor={gardenDecor} onDecorChange={handleSetGardenDecor} gardenXp={gardenXp} />;
            case Tab.Settings:
                return <SettingsScreen user={user} habits={habits} onLogout={handleLogout} onUpdateUser={handleUpdateUser} habitReminder={habitReminder} onSetHabitReminder={handleSetHabitReminder} isDarkMode={isDarkMode} onSetIsDarkMode={setIsDarkMode} notifications={notifications} onSetNotifications={setNotifications} />;
            default:
                return <HomeScreen user={user} moodHistory={moodHistory} habits={habits} journalEntries={journalEntries} cycleData={{cycles, dayLogs}} onNavigate={setActiveTab} gardenXp={gardenXp} />;
        }
    };

    if (isLoading) return <SplashScreen />;

    if (!user) {
        return showSignUp ? (
            <SignUpScreen onSignUp={handleSignUp} onSwitchToSignIn={() => setShowSignUp(false)} />
        ) : (
            <SignInScreen onLogin={handleLogin} onSwitchToSignUp={() => setShowSignUp(true)} />
        );
    }

    const navItems = [
        { tab: Tab.Dashboard, Icon: DashboardIcon, label: 'Dashboard' },
        { tab: Tab.Mood, Icon: MoodIcon, label: 'Mood' },
        { tab: Tab.Habit, Icon: HabitIcon, label: 'Habits' },
        { tab: Tab.Journal, Icon: JournalIcon, label: 'Journal' },
        { tab: Tab.Period, Icon: PeriodIcon, label: 'Period' },
        { tab: Tab.Garden, Icon: GardenIcon, label: 'Garden' },
    ];

    return (
        <div className="min-h-screen bg-[#FFFBF9] dark:bg-slate-900 flex flex-col relative" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <PomegranateFruitIcon className="absolute top-0 right-0 w-64 h-64 text-[#F4ABC4] opacity-20 dark:opacity-10 transform -rotate-12 translate-x-1/4 -translate-y-1/4 pointer-events-none z-0" />
            
            <header className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-pink-100 dark:border-slate-700">
                {/* Menu Action (Left) */}
                <button 
                    onClick={() => setActiveTab(Tab.Settings)}
                    className="flex items-center gap-2 p-2 -ml-2 rounded-lg hover:bg-pink-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300 group"
                    aria-label="Open Menu"
                >
                    <MenuIcon className="h-6 w-6 text-[#E18AAA] group-hover:text-pink-600" />
                    <span className="font-bold text-sm ml-1 group-hover:text-pink-600">Menu</span>
                </button>

                {/* Logo (Center) */}
                <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
                    <AnaraLogo className="h-10 w-10 text-[#F4ABC4] mr-2"/>
                    <h1 className="text-2xl font-bold text-[#E18AAA] dark:text-pink-400" style={{fontFamily: "'Playfair Display', serif"}}>Anara</h1>
                </div>

                {/* Profile (Right) */}
                <button
                    onClick={() => setActiveTab(Tab.Settings)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-pink-100 dark:bg-slate-700 text-pink-500 dark:text-pink-400 font-bold text-lg hover:bg-pink-200 dark:hover:bg-slate-600 transition-colors overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-md"
                    aria-label="User Profile"
                >
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        user?.name?.[0]?.toUpperCase() || <UserIcon className="h-6 w-6"/>
                    )}
                </button>
            </header>
            
            <main className="flex-grow p-4 pb-24 overflow-y-auto z-0">
                {renderScreen()}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-t border-pink-100 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <nav className="flex justify-around max-w-md mx-auto">
                    {navItems.map(({ tab, Icon, label }) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-all duration-300 ${activeTab === tab ? 'text-[#E18AAA] dark:text-pink-400 -translate-y-1' : 'text-[#8D7F85] dark:text-slate-400 hover:text-[#F4ABC4] dark:hover:text-pink-400'}`}
                            aria-label={label}
                        >
                            <Icon className={`h-6 w-6 mb-1 ${activeTab === tab ? 'drop-shadow-sm' : ''}`} />
                            <span className={`text-[10px] font-bold ${activeTab === tab ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
                            {activeTab === tab && <div className="mt-1 h-1 w-8 bg-[#E18AAA] dark:bg-pink-400 rounded-full shadow-[0_0_8px_rgba(225,138,170,0.6)]"></div>}
                        </button>
                    ))}
                </nav>
            </footer>
            
            {/* NaraFriend Chatbot */}
            <div className="fixed bottom-24 right-4 z-20">
                 <button
                    onClick={() => setIsNaraFriendOpen(!isNaraFriendOpen)}
                    className="bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-full p-4 shadow-xl hover:scale-110 transform transition-transform duration-200 ring-4 ring-white/30 backdrop-blur-sm"
                    aria-label="Open NaraFriend AI Assistant"
                >
                    <SparklesIcon className="w-7 h-7"/>
                </button>
            </div>

            {isNaraFriendOpen && (
                <NaraFriend
                    isOpen={isNaraFriendOpen}
                    onClose={() => setIsNaraFriendOpen(false)}
                    user={user}
                    appData={{
                        moodHistory,
                        habits,
                        journalEntries,
                        cycles,
                        dayLogs,
                    }}
                    onJournalEntry={handleSetJournalEntries}
                />
            )}
        </div>
    );
};

export default App;