
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DashboardIcon, MoodIcon, HabitIcon, JournalIcon, PeriodIcon, GardenIcon, SettingsIcon, AnaraLogo, UserIcon, PomegranateFruitIcon, SparklesIcon, MenuIcon, SleepTrackerIcon, MenuGridIcon } from './components/icons.tsx';
import HomeScreen from './components/HomeScreen.tsx';
import MoodTrackerScreen from './components/MoodTrackerScreen.tsx';
import HabitTrackerScreen from './components/HabitTrackerScreen.tsx';
import JournalScreen from './components/JournalScreen.tsx';
import PeriodTrackerScreen from './components/PeriodTrackerScreen.tsx';
import SleepTrackerScreen from './components/SleepTrackerScreen.tsx';
import GardenScreen from './components/GardenScreen.tsx';
import SettingsScreen from './components/SettingsScreen.tsx';
import MenuScreen from './components/MenuScreen.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import SignInScreen from './components/auth/SignInScreen.tsx';
import SignUpScreen from './components/auth/SignUpScreen.tsx';
import VerificationScreen from './components/auth/VerificationScreen.tsx';
import { Tab, MoodEntry, Habit, JournalEntry, Cycle, DayLog, GardenDecor, User, HabitReminder, NotificationSetting, SleepEntry } from './types.ts';
import NaraFriend from './components/NaraFriend.tsx';

// --- SESSION & SECURITY UTILITIES ---
const SESSION_TOKEN_KEY = 'anara_auth_token';
const PENDING_VERIFICATION_KEY = 'anara_pending_email';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const AUTH_AUDIT_KEY = 'anara_auth_audit';

class AuthLogger {
    private static readonly MAX_LOGS = 100;

    static log(eventType: 'SIGN_IN' | 'SIGN_UP' | 'VERIFY' | 'SESSION', email: string, status: 'SUCCESS' | 'FAILURE' | 'CANCEL' | 'REDIRECT', metadata: any = {}) {
        try {
            const raw = localStorage.getItem(AUTH_AUDIT_KEY);
            const logs = raw ? JSON.parse(raw) : [];
            const newEntry = {
                id: crypto.randomUUID?.() || Date.now().toString(),
                timestamp: new Date().toISOString(),
                eventType,
                email: email.toLowerCase().trim(),
                status,
                ...metadata
            };
            logs.unshift(newEntry);
            const limitedLogs = logs.slice(0, this.MAX_LOGS);
            localStorage.setItem(AUTH_AUDIT_KEY, JSON.stringify(limitedLogs));
        } catch (e) {
            console.error("Critical: AuthLogger failed to persist entry.", e);
        }
    }
}

const AuthUtils = {
    generateToken: (email: string): string => btoa(JSON.stringify({ email, expiry: Date.now() + TOKEN_EXPIRY_MS })),
    validateToken: (token: string | null): string | null => {
        if (!token) return null;
        try {
            const { email, expiry } = JSON.parse(atob(token));
            const isValid = Date.now() <= expiry;
            if (!isValid) AuthLogger.log('SESSION', email, 'FAILURE', { reason: 'Token Expired' });
            return isValid ? email : null;
        } catch { 
            return null; 
        }
    }
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [showSignUp, setShowSignUp] = useState(true);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(() => localStorage.getItem(PENDING_VERIFICATION_KEY));
    const [activeTab, setActiveTab] = useState<Tab>(() => (localStorage.getItem('anaraActiveTab') as Tab) || Tab.Dashboard);
    const [isNaraFriendOpen, setIsNaraFriendOpen] = useState(false);

    // --- DATA STATE ---
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
        const saved = localStorage.getItem('anaraMoodHistory');
        return saved ? JSON.parse(saved).map((e: any) => ({ ...e, date: new Date(e.date) })) : [];
    });
    const [habits, setHabits] = useState<Habit[]>(() => JSON.parse(localStorage.getItem('anaraHabits') || '[]'));
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
        const saved = localStorage.getItem('anaraJournalEntries');
        return saved ? JSON.parse(saved).map((e: any) => ({ ...e, date: new Date(e.date) })) : [];
    });
    const [cycles, setCycles] = useState<Cycle[]>(() => JSON.parse(localStorage.getItem('anaraCycles') || '[]'));
    const [dayLogs, setDayLogs] = useState<Record<string, DayLog>>(() => JSON.parse(localStorage.getItem('anaraDayLogs') || '{}'));
    const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>(() => {
        const saved = localStorage.getItem('anaraSleepHistory');
        return saved ? JSON.parse(saved).map((e: any) => ({ ...e, date: new Date(e.date) })) : [];
    });
    const [gardenDecor, setGardenDecor] = useState<GardenDecor>(() => JSON.parse(localStorage.getItem('anaraGardenDecor') || '{"activeBackground":"Sunrise"}'));
    const [gardenXp, setGardenXp] = useState<number>(() => Number(localStorage.getItem('anaraGardenXp') || '0'));
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('anaraIsDarkMode') === 'true');
    const [isIslamicGuidanceOn, setIsIslamicGuidanceOn] = useState<boolean>(() => localStorage.getItem('anaraIslamicGuidance') === 'true');

    const saveAppState = useCallback(() => {
        if (isLoading) return;
        try {
            localStorage.setItem('anaraMoodHistory', JSON.stringify(moodHistory));
            localStorage.setItem('anaraHabits', JSON.stringify(habits));
            localStorage.setItem('anaraJournalEntries', JSON.stringify(journalEntries));
            localStorage.setItem('anaraCycles', JSON.stringify(cycles));
            localStorage.setItem('anaraDayLogs', JSON.stringify(dayLogs));
            localStorage.setItem('anaraSleepHistory', JSON.stringify(sleepHistory));
            localStorage.setItem('anaraGardenDecor', JSON.stringify(gardenDecor));
            localStorage.setItem('anaraGardenXp', JSON.stringify(gardenXp));
            localStorage.setItem('anaraIsDarkMode', JSON.stringify(isDarkMode));
            localStorage.setItem('anaraIslamicGuidance', JSON.stringify(isIslamicGuidanceOn));
            localStorage.setItem('anaraActiveTab', activeTab);
        } catch (e) {
            console.error("Critical: Failed to save application state to local storage", e);
        }
    }, [moodHistory, habits, journalEntries, cycles, dayLogs, sleepHistory, gardenDecor, gardenXp, isDarkMode, isIslamicGuidanceOn, activeTab, isLoading]);

    useEffect(() => {
        saveAppState();
    }, [saveAppState]);

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem(SESSION_TOKEN_KEY);
            const validEmail = AuthUtils.validateToken(token);
            if (validEmail) {
                const db = JSON.parse(localStorage.getItem('anaraAuthDB') || '[]');
                const userRec = db.find((u: any) => u.email.toLowerCase() === validEmail.toLowerCase());
                if (userRec?.isVerified) {
                    setUser({ name: userRec.name, email: userRec.email, profilePicture: userRec.profilePicture, isVerified: true });
                }
            }
            setTimeout(() => setIsLoading(false), 1000);
        };
        checkSession();
    }, []);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    const handleLogin = (email: string, pass?: string) => {
        const db = JSON.parse(localStorage.getItem('anaraAuthDB') || '[]');
        const userRec = db.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (userRec && userRec.password === pass) {
            if (!userRec.isVerified) {
                setUnverifiedEmail(email);
                localStorage.setItem(PENDING_VERIFICATION_KEY, email);
                return false;
            }
            localStorage.setItem(SESSION_TOKEN_KEY, AuthUtils.generateToken(email));
            setUser({ name: userRec.name, email: userRec.email, profilePicture: userRec.profilePicture, isVerified: true });
            return true;
        }
        throw new Error("Invalid credentials.");
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setActiveTab(Tab.Dashboard);
    };

    if (isLoading) return <SplashScreen />;

    if (unverifiedEmail) {
        return <VerificationScreen 
            email={unverifiedEmail} 
            onVerified={() => {
                const db = JSON.parse(localStorage.getItem('anaraAuthDB') || '[]');
                const idx = db.findIndex((u: any) => u.email.toLowerCase() === unverifiedEmail.toLowerCase());
                if (idx !== -1) {
                    db[idx].isVerified = true;
                    localStorage.setItem('anaraAuthDB', JSON.stringify(db));
                    localStorage.setItem(SESSION_TOKEN_KEY, AuthUtils.generateToken(unverifiedEmail));
                    setUser({ name: db[idx].name, email: db[idx].email, isVerified: true });
                    setUnverifiedEmail(null);
                    localStorage.removeItem(PENDING_VERIFICATION_KEY);
                }
            }} 
            onBackToSignIn={() => { 
                setUnverifiedEmail(null); 
                localStorage.removeItem(PENDING_VERIFICATION_KEY); 
            }} 
        />;
    }

    if (!user) {
        return showSignUp ? (
            <SignUpScreen onSignUp={(n, e, p) => {
                const db = JSON.parse(localStorage.getItem('anaraAuthDB') || '[]');
                db.push({ name: n, email: e.toLowerCase(), password: p, isVerified: false });
                localStorage.setItem('anaraAuthDB', JSON.stringify(db));
                setUnverifiedEmail(e.toLowerCase());
                localStorage.setItem(PENDING_VERIFICATION_KEY, e.toLowerCase());
            }} onSwitchToSignIn={() => setShowSignUp(false)} />
        ) : (
            <SignInScreen onLogin={handleLogin} onSwitchToSignUp={() => setShowSignUp(true)} />
        );
    }

    const navItems = [
        { tab: Tab.Dashboard, Icon: DashboardIcon, label: 'Home' },
        { tab: Tab.Mood, Icon: MoodIcon, label: 'Mood' },
        { tab: Tab.Habit, Icon: HabitIcon, label: 'Habit' },
        { tab: Tab.Journal, Icon: JournalIcon, label: 'Journal' },
        { tab: Tab.Period, Icon: PeriodIcon, label: 'Period' },
        { tab: Tab.Sleep, Icon: SleepTrackerIcon, label: 'Sleep' },
        { tab: Tab.Garden, Icon: GardenIcon, label: 'Garden' },
    ];

    return (
        <div className="min-h-screen bg-[#FFFBF9] dark:bg-slate-900 flex flex-col relative overflow-x-hidden" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <PomegranateFruitIcon className="absolute top-20 right-0 w-64 h-64 text-[#F4ABC4] opacity-10 dark:opacity-5 transform -rotate-12 translate-x-1/4 pointer-events-none z-0" />
            <header className="flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-pink-50 dark:border-slate-700">
                <button onClick={() => setActiveTab(Tab.Menu)} className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-700 transition-colors z-30">
                    <MenuIcon className="h-6 w-6 text-[#E18AAA]" />
                </button>
                <div className="flex items-center absolute inset-x-0 justify-center cursor-pointer pointer-events-none" onClick={() => setActiveTab(Tab.Dashboard)}>
                    <div className="flex items-center pointer-events-auto">
                        <AnaraLogo className="h-10 w-10 text-[#F4ABC4] mr-2"/>
                        <h1 className="text-2xl font-bold text-[#E18AAA] dark:text-pink-400 font-serif">Anara</h1>
                    </div>
                </div>
                <button onClick={() => setActiveTab(Tab.Settings)} className="h-10 w-10 flex items-center justify-center rounded-full bg-pink-100 dark:bg-slate-700 text-pink-500 font-bold overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-md z-30 transition-transform active:scale-90">
                    {user?.profilePicture ? <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                </button>
            </header>
            <main className="flex-grow p-4 pb-24 overflow-y-auto z-0 relative">
                {(() => {
                    switch (activeTab) {
                        case Tab.Dashboard: return <HomeScreen user={user} moodHistory={moodHistory} habits={habits} journalEntries={journalEntries} cycleData={{cycles, dayLogs}} onNavigate={setActiveTab} gardenXp={gardenXp} sleepHistory={sleepHistory} isIslamicGuidanceOn={isIslamicGuidanceOn} />;
                        case Tab.Mood: return <MoodTrackerScreen moodHistory={moodHistory} onAddMoodEntry={(data) => setMoodHistory([{ ...data, id: Date.now().toString(), date: new Date() }, ...moodHistory])} />;
                        case Tab.Habit: return <HabitTrackerScreen habits={habits} setHabits={setHabits} onToggleHabit={(id) => {
                            setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed, streak: h.completed ? Math.max(0, (h.streak || 0) - 1) : (h.streak || 0) + 1 } : h));
                            if (!habits.find(h => h.id === id)?.completed) setGardenXp(p => p + 1);
                        }} moodHistory={moodHistory} journalEntries={journalEntries} isIslamicGuidanceOn={isIslamicGuidanceOn} />;
                        case Tab.Journal: return <JournalScreen entries={journalEntries} setEntries={setJournalEntries} moodHistory={moodHistory} user={user} cycleData={{cycles, dayLogs}} />;
                        case Tab.Period: return <PeriodTrackerScreen cycles={cycles} onUpdateCycles={setCycles} dayLogs={dayLogs} setDayLogs={setDayLogs} habits={habits} setHabits={setHabits} isIslamicGuidanceOn={isIslamicGuidanceOn} />;
                        case Tab.Sleep: return <SleepTrackerScreen user={user} sleepHistory={sleepHistory} onAddEntry={(e) => setSleepHistory([...sleepHistory, e])} onDeleteEntry={(id) => setSleepHistory(sleepHistory.filter(e => e.id !== id))} />;
                        case Tab.Garden: return <GardenScreen habits={habits} gardenDecor={gardenDecor} onDecorChange={setGardenDecor} gardenXp={gardenXp} />;
                        case Tab.Settings: return <SettingsScreen user={user} habits={habits} onLogout={handleLogout} onUpdateUser={setUser} habitReminder={{enabled:true, time:'09:00', habitsToRemind:[], frequency:'Daily'}} onSetHabitReminder={()=>{}} isDarkMode={isDarkMode} onSetIsDarkMode={setIsDarkMode} notifications={{}} onSetNotifications={()=>{}} isIslamicGuidanceOn={isIslamicGuidanceOn} onSetIslamicGuidanceOn={setIsIslamicGuidanceOn} />;
                        case Tab.Menu: return <MenuScreen user={user} onNavigate={setActiveTab} onLogout={handleLogout} />;
                        default: return <HomeScreen user={user} moodHistory={moodHistory} habits={habits} journalEntries={journalEntries} cycleData={{cycles, dayLogs}} onNavigate={setActiveTab} gardenXp={gardenXp} sleepHistory={sleepHistory} isIslamicGuidanceOn={isIslamicGuidanceOn} />;
                    }
                })()}
            </main>
            <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-pink-100 dark:border-slate-700 z-50">
                <nav className="grid grid-cols-7 h-16 max-w-4xl mx-auto">
                    {navItems.map(({ tab, Icon, label }) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center justify-center transition-all ${activeTab === tab ? 'text-[#E18AAA] dark:text-pink-400' : 'text-[#8D7F85] dark:text-slate-400'}`}>
                            <Icon className="h-6 w-6" />
                            <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
                        </button>
                    ))}
                </nav>
            </footer>
            <div className="fixed bottom-24 right-4 z-40">
                <button onClick={() => setIsNaraFriendOpen(!isNaraFriendOpen)} className="bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-full p-4 shadow-xl hover:scale-110 transform transition-all ring-4 ring-white/30 backdrop-blur-sm">
                    <SparklesIcon className="w-7 h-7"/>
                </button>
            </div>
            {isNaraFriendOpen && <NaraFriend isOpen={isNaraFriendOpen} onClose={() => setIsNaraFriendOpen(false)} user={user} appData={{ moodHistory, habits, journalEntries }} onJournalEntry={setJournalEntries} />}
        </div>
    );
};

export default App;
