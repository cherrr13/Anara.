
import React, { useState, useRef, useEffect } from 'react';
import { Habit, User, HabitReminder, NotificationSetting } from '../types';
import { PeriodIcon, BellIcon, LockIcon, TrashIcon, UserIcon, EditIcon, BackIcon } from './icons';

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
}

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label?: string }> = ({ enabled, onChange, label }) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(!enabled);
        }}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E18AAA] cursor-pointer ${enabled ? 'bg-[#E18AAA]' : 'bg-gray-200 dark:bg-slate-600'}`}
        aria-pressed={enabled}
        aria-label={label || "Toggle setting"}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; titleColor?: string }> = ({ title, children, titleColor = "text-gray-800 dark:text-slate-100" }) => (
    <div>
        <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            {children}
        </div>
    </div>
);

const ChangePasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match.");
            return;
        }
        if (newPassword.length < 8) {
             alert("Password must be at least 8 characters long.");
            return;
        }
        // In a real app, this would be an API call.
        alert("Password changed successfully!");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">Change Password</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <BackIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-[#E18AAA] text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, habits, onLogout, onUpdateUser, habitReminder, onSetHabitReminder, isDarkMode, onSetIsDarkMode, notifications, onSetNotifications }) => {
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
            reader.onload = (e) => {
                setProfilePicture(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        if (user) {
            onUpdateUser({
                ...user,
                name: displayName,
                profilePicture: profilePicture,
            });
             if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
    };
    
    const handleNotificationChange = (id: string, field: keyof NotificationSetting, value: string | number | boolean | NotificationSetting['method']) => {
        onSetNotifications({
            ...notifications,
            [id]: { ...notifications[id], [field]: value }
        });
    };
    
    const handleHabitReminderChange = (field: keyof HabitReminder, value: any) => {
        onSetHabitReminder({ ...habitReminder, [field]: value });
    };

    const handleHabitToRemindChange = (habitId: string) => {
        const currentHabits = habitReminder.habitsToRemind;
        const newHabits = currentHabits.includes(habitId) 
            ? currentHabits.filter(id => id !== habitId) 
            : [...currentHabits, habitId];
        onSetHabitReminder({ ...habitReminder, habitsToRemind: newHabits });
    };

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    const notificationTypes = [
        { id: 'periodStart', title: 'Period Start', desc: 'On the day' },
        { id: 'ovulation', title: 'Ovulation', desc: '1 day before' },
    ];
    
    return (
        <div className="space-y-8">
            {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
            <div>
                <h2 className="text-3xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>Settings</h2>
                <p className="text-[#8D7F85] dark:text-slate-400">Manage your account and preferences</p>
            </div>

            <SettingsCard title="User Profile">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-pink-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-900 shadow-md">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile Preview" className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-12 w-12 text-pink-300 dark:text-pink-400" />
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-white dark:bg-slate-600 h-8 w-8 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 transition"
                            aria-label="Upload profile picture"
                        >
                            <EditIcon className="w-4 h-4 text-gray-600 dark:text-slate-200" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePictureUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Display Name</label>
                        <input 
                            type="text" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-[#F4ABC4] transition"
                        />
                    </div>
                    
                    <button 
                        onClick={handleSaveProfile}
                        className="w-full bg-[#E18AAA] text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition"
                    >
                        Save Profile
                    </button>
                </div>
            </SettingsCard>

            <SettingsCard title="Account Information">
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Email</label>
                        <input type="email" value={user?.email || ''} readOnly className="w-full p-3 bg-slate-100 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 text-center pt-2">Your email address cannot be changed.</p>
                </div>
            </SettingsCard>

            <SettingsCard title="Preferences">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <PeriodIcon className="w-6 h-6 text-pink-400" />
                             <div>
                                <p className="font-semibold text-gray-700 dark:text-slate-200">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {isDarkMode ? 'On' : 'Off'}
                                </p>
                             </div>
                        </div>
                        <ToggleSwitch enabled={isDarkMode} onChange={onSetIsDarkMode} label="Toggle Dark Mode" />
                    </div>
                </div>
            </SettingsCard>
            
            <SettingsCard title="Notification Settings">
                <div className="space-y-4 divide-y divide-pink-100 dark:divide-slate-700">
                    {notificationTypes.map(({ id, title, desc }) => (
                         <div key={id} className="pt-4 first:pt-0">
                             <div className="flex justify-between items-center">
                                 <div>
                                     <p className="font-semibold text-gray-700 dark:text-slate-200">{title}</p>
                                     <p className="text-sm text-gray-500 dark:text-slate-400">{desc}</p>
                                 </div>
                                 <ToggleSwitch enabled={notifications[id].enabled} onChange={(enabled) => handleNotificationChange(id, 'enabled', enabled)} label={`Toggle ${title} notifications`} />
                             </div>
                             {notifications[id].enabled && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Time</label>
                                        <input type="time" value={notifications[id].time} onChange={e => handleNotificationChange(id, 'time', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg text-sm"/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Days Before</label>
                                        <input type="number" value={notifications[id].daysBefore} onChange={e => handleNotificationChange(id, 'daysBefore', parseInt(e.target.value, 10))} min="0" className="w-full p-2 bg-slate-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg text-sm"/>
                                    </div>
                                </div>
                             )}
                         </div>
                    ))}
                    <div className="pt-4">
                        <div className="flex justify-between items-center">
                             <div>
                                 <p className="font-semibold text-gray-700 dark:text-slate-200">Habit Reminder</p>
                                 <p className="text-sm text-gray-500 dark:text-slate-400">Get reminders for your habits</p>
                             </div>
                             <ToggleSwitch enabled={habitReminder.enabled} onChange={(enabled) => handleHabitReminderChange('enabled', enabled)} label="Toggle Habit Reminders" />
                         </div>
                         {habitReminder.enabled && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2 block">Reminder Time</label>
                                    <input type="time" value={habitReminder.time} onChange={e => handleHabitReminderChange('time', e.target.value)} className="w-full max-w-xs p-2 bg-slate-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg text-sm"/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2 block">Select Habits to Remind</label>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        {habits.map(habit => (
                                            <label key={habit.id} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded text-pink-500 focus:ring-pink-400 h-4 w-4 border-gray-300 bg-gray-50 dark:bg-slate-600 dark:border-slate-500"
                                                    checked={habitReminder.habitsToRemind.includes(habit.id)} 
                                                    onChange={() => handleHabitToRemindChange(habit.id)}
                                                />
                                                {habit.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2 block">Frequency</label>
                                    <select value={habitReminder.frequency} onChange={e => handleHabitReminderChange('frequency', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg text-sm max-w-xs">
                                        <option>Daily</option>
                                        <option>Weekdays</option>
                                        <option>Weekends</option>
                                    </select>
                                </div>
                            </div>
                         )}
                    </div>
                    <div className="pt-6">
                        <button onClick={requestNotificationPermission} disabled={notificationPermission === 'granted' || notificationPermission === 'denied'} className="w-full text-center py-3 border-2 border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-slate-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 transition-colors">
                           <BellIcon className="w-5 h-5" /> 
                           {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable App Notifications'}
                        </button>
                        {notificationPermission === 'denied' && <p className="text-xs text-red-500 text-center mt-2">Notifications blocked. Please enable them in your browser settings.</p>}
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title="Security">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <LockIcon className="w-6 h-6 text-pink-500"/>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-slate-200">Change Password</p>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Update your password regularly</p>
                        </div>
                    </div>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="font-semibold text-sm text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 px-4 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500">Change</button>
                </div>
            </SettingsCard>
            
            <div className="pt-4">
                <button 
                    onClick={onLogout} 
                    className="w-full text-center py-3 border-2 border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
