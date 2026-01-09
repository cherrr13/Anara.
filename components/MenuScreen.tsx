
import React from 'react';
import { User, Tab } from '../types';
import { 
    UserIcon, HabitIcon, PeriodIcon, SleepTrackerIcon, SettingsIcon, 
    BackIcon, MoonIcon, BellIcon, LockIcon, JournalIcon, MoodIcon
} from './icons';

interface MenuScreenProps {
    user: User | null;
    onNavigate: (tab: Tab) => void;
    onLogout: () => void;
}

const MenuCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    onClick: () => void;
    colorClass: string;
}> = ({ icon, title, description, onClick, colorClass }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all active:scale-[0.98] w-full text-left group"
    >
        <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform shadow-inner`}>
            {icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-bold font-serif text-gray-800 dark:text-slate-100 text-lg">{title}</h3>
            <p className="text-xs font-sans text-gray-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
        <div className="text-gray-300 dark:text-slate-600 group-hover:text-[#E18AAA] transition-colors">
            <BackIcon className="w-5 h-5 rotate-180" />
        </div>
    </button>
);

const MenuScreen: React.FC<MenuScreenProps> = ({ user, onNavigate, onLogout }) => {
    return (
        <div className="space-y-8 pb-20 animate-fade-in max-w-2xl mx-auto">
            {/* Header Standardized */}
            <div className="mb-2">
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Main Menu</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">Navigate through your wellness sanctuary.</p>
            </div>

            {/* Profile Summary Standardized Typography */}
            <div className="bg-gradient-to-br from-[#F4ABC4] via-[#E18AAA] to-purple-500 dark:from-pink-900 dark:to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/50 overflow-hidden shadow-xl">
                        {user?.profilePicture ? (
                             <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-white" />
                        )}
                    </div>
                    <div className="text-center sm:text-left flex-grow space-y-1">
                        <h3 className="text-3xl font-bold font-serif">{user?.name || 'Blooming Friend'}</h3>
                        <p className="text-white/80 font-sans text-sm font-medium">{user?.email}</p>
                        <button 
                            onClick={() => onNavigate(Tab.Settings)}
                            className="mt-3 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all text-xs font-bold font-sans uppercase tracking-widest border border-white/30"
                        >
                            Manage Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid Standardized Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCard 
                    icon={<MoodIcon className="w-6 h-6 text-orange-600 dark:text-orange-300" />}
                    title="Mood Lab"
                    description="Analyze your daily vibrations"
                    onClick={() => onNavigate(Tab.Mood)}
                    colorClass="bg-orange-100 dark:bg-orange-900/30"
                />
                <MenuCard 
                    icon={<HabitIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />}
                    title="Habit Engine"
                    description="Build resilience and consistency"
                    onClick={() => onNavigate(Tab.Habit)}
                    colorClass="bg-emerald-100 dark:bg-emerald-900/30"
                />
                <MenuCard 
                    icon={<JournalIcon className="w-6 h-6 text-pink-600 dark:text-pink-300" />}
                    title="Inner Sanctuary"
                    description="Reflect and process your story"
                    onClick={() => onNavigate(Tab.Journal)}
                    colorClass="bg-pink-100 dark:bg-pink-900/30"
                />
                <MenuCard 
                    icon={<PeriodIcon className="w-6 h-6 text-rose-600 dark:text-rose-300" />}
                    title="Cycle Tracker"
                    description="Harmonize with your nature"
                    onClick={() => onNavigate(Tab.Period)}
                    colorClass="bg-rose-100 dark:bg-rose-900/30"
                />
            </div>

            {/* Footer List Standardized Font */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-slate-700 space-y-1">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl transition text-gray-700 dark:text-slate-300 text-sm font-bold font-sans">
                    <div className="flex items-center gap-3">
                        <BellIcon className="w-5 h-5 text-gray-400" />
                        <span className="uppercase tracking-widest text-[10px]">App Notifications</span>
                    </div>
                    <span className="text-[10px] font-bold bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                </button>
                <div className="h-px bg-gray-50 dark:bg-slate-700 mx-4"></div>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl transition text-gray-700 dark:text-slate-300 text-sm font-bold font-sans">
                    <div className="flex items-center gap-3">
                        <LockIcon className="w-5 h-5 text-gray-400" />
                        <span className="uppercase tracking-widest text-[10px]">Privacy & Trust</span>
                    </div>
                </button>
            </div>

            <button 
                onClick={onLogout}
                className="w-full py-6 text-center text-red-500 font-bold font-sans text-xs uppercase tracking-[0.25em] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all shadow-sm"
            >
                End Session
            </button>
        </div>
    );
};

export default MenuScreen;
