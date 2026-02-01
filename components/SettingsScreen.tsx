
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Habit, User, HabitReminder, NotificationSetting } from '../types';
import { PeriodIcon, BellIcon, LockIcon, UserIcon, EditIcon, BackIcon, MoonStarIcon, EyeIcon, EyeOffIcon, SparklesIcon } from './icons';
import ImageEditor from './ImageEditor';

interface SettingsScreenProps {
    user: User | null;
    habits: Habit[];
    onLogout: () => void;
    onUpdateUser: (user: User) => void;
    habitReminder: HabitReminder;
    onSetHabitReminder: (reminder: HabitReminder) => void;
    isDarkMode: boolean;
    onSetIsDarkMode: (enabled: boolean) => void;
    notifications: Record<string, NotificationSetting>;
    onSetNotifications: (notifications: Record<string, NotificationSetting>) => void;
    isIslamicGuidanceOn: boolean;
    onSetIslamicGuidanceOn: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label?: string }> = ({ enabled, onChange, label }) => (
    <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all focus:outline-none ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ${enabled ? 'bg-[#E18AAA]' : 'bg-gray-200 dark:bg-slate-600'}`}
        aria-label={label || "Toggle"}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-4">{title}</h3>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
            {children}
        </div>
    </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, habits, onLogout, onUpdateUser, habitReminder, onSetHabitReminder, isDarkMode, onSetIsDarkMode, notifications, onSetNotifications, isIslamicGuidanceOn, onSetIslamicGuidanceOn }) => {
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (user) {
            setDisplayName(user.name);
            setProfilePicture(user.profilePicture || null);
        }
    }, [user]);

    const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setEditingImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveProfile = () => {
        if (user) {
            onUpdateUser({ ...user, name: displayName, profilePicture });
            if ('vibrate' in navigator) navigator.vibrate(50);
        }
    };
    
    return (
        <div className="space-y-10 pb-20 max-w-2xl mx-auto">
            {editingImage && (
                <ImageEditor imageUrl={editingImage} onSave={(url) => { setProfilePicture(url); setEditingImage(null); }} onCancel={() => setEditingImage(null)} />
            )}

            {/* Standardized Header */}
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Settings</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">Customize your Anara experience.</p>
            </div>

            <SettingsCard title="Profile Information">
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                        <div className="h-28 w-28 rounded-full bg-pink-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-14 w-14 text-pink-300 dark:text-pink-400" />
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-[#E18AAA] text-white h-9 w-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-pink-600 transition-all active:scale-90"
                        >
                            <EditIcon className="w-4 h-4" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handlePictureUpload} accept="image/*" className="hidden" />
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2 block">Display Name</label>
                        <input 
                            type="text" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-base font-sans focus:ring-2 focus:ring-[#F4ABC4] transition-all dark:text-slate-200 outline-none"
                        />
                    </div>
                    
                    <button onClick={handleSaveProfile} className="w-full bg-[#E18AAA] hover:bg-pink-600 text-white font-bold font-sans py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs">
                        Update Profile
                    </button>
                </div>
            </SettingsCard>

            <SettingsCard title="Ritual Reminders">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/40 rounded-xl text-pink-500"><BellIcon className="w-6 h-6" /></div>
                            <div>
                                <p className="font-bold font-sans text-gray-800 dark:text-slate-100 text-sm uppercase tracking-wider">Daily Nudges</p>
                                <p className="text-xs font-sans text-gray-500 dark:text-slate-400">Stay consistent with your rituals</p>
                            </div>
                        </div>
                        <ToggleSwitch 
                            enabled={habitReminder.enabled} 
                            onChange={(enabled) => onSetHabitReminder({ ...habitReminder, enabled })} 
                        />
                    </div>

                    {habitReminder.enabled && (
                        <div className="space-y-6 pt-6 border-t border-gray-50 dark:border-slate-700 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2 block">Reminder Time</label>
                                    <input 
                                        type="time" 
                                        value={habitReminder.time}
                                        onChange={(e) => onSetHabitReminder({ ...habitReminder, time: e.target.value })}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-base font-sans focus:ring-2 focus:ring-[#F4ABC4] outline-none dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2 block">Frequency</label>
                                    <select 
                                        value={habitReminder.frequency}
                                        onChange={(e) => onSetHabitReminder({ ...habitReminder, frequency: e.target.value as any })}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-sm font-sans focus:ring-2 focus:ring-[#F4ABC4] outline-none dark:text-slate-200"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekdays">Weekdays</option>
                                        <option value="Weekends">Weekends</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3 block">Target Rituals</label>
                                <div className="flex flex-wrap gap-2">
                                    {habits.map(habit => {
                                        const isSelected = habitReminder.habitsToRemind.includes(habit.id);
                                        return (
                                            <button
                                                key={habit.id}
                                                onClick={() => {
                                                    const newHabits = isSelected 
                                                        ? habitReminder.habitsToRemind.filter(id => id !== habit.id)
                                                        : [...habitReminder.habitsToRemind, habit.id];
                                                    onSetHabitReminder({ ...habitReminder, habitsToRemind: newHabits });
                                                    if ('vibrate' in navigator) navigator.vibrate(5);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold font-sans border-2 transition-all ${isSelected ? 'bg-pink-50 border-[#E18AAA] text-[#E18AAA] shadow-sm' : 'bg-gray-50 border-transparent text-gray-400 dark:bg-slate-700'}`}
                                            >
                                                {habit.name}
                                            </button>
                                        );
                                    })}
                                    {habits.length === 0 && <p className="text-xs text-gray-400 italic">No rituals created yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SettingsCard>

            <SettingsCard title="Application Preferences">
                <div className="space-y-6">
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-500"><MoonStarIcon className="w-6 h-6" /></div>
                             <div>
                                <p className="font-bold font-sans text-gray-800 dark:text-slate-100 text-sm uppercase tracking-wider">Appearance</p>
                                <p className="text-xs font-sans text-gray-500 dark:text-slate-400">Dark Mode experience</p>
                             </div>
                        </div>
                        <ToggleSwitch enabled={isDarkMode} onChange={onSetIsDarkMode} />
                    </div>
                    
                    <div className="h-px bg-gray-50 dark:bg-slate-700"></div>

                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl text-emerald-500"><SparklesIcon className="w-6 h-6" /></div>
                             <div>
                                <p className="font-bold font-sans text-gray-800 dark:text-slate-100 text-sm uppercase tracking-wider">Islamic Guidance</p>
                                <p className="text-xs font-sans text-gray-500 dark:text-slate-400">Spiritual insights & acts</p>
                             </div>
                        </div>
                        <ToggleSwitch enabled={isIslamicGuidanceOn} onChange={onSetIslamicGuidanceOn} />
                    </div>
                </div>
            </SettingsCard>

            <button onClick={onLogout} className="w-full py-5 border-2 border-red-100 dark:border-red-900/30 rounded-[2rem] text-red-500 font-bold font-sans uppercase tracking-[0.2em] text-xs hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-95 shadow-sm">
                Sign Out from Anara
            </button>
        </div>
    );
};

export default SettingsScreen;
