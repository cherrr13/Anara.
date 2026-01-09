
export enum Tab {
    Dashboard = 'DASHBOARD',
    Mood = 'MOOD',
    Habit = 'HABIT',
    Journal = 'JOURNAL',
    Period = 'PERIOD',
    Sleep = 'SLEEP',
    Garden = 'GARDEN',
    Settings = 'SETTINGS',
    Menu = 'MENU',
}

export interface User {
    name: string;
    email: string;
    profilePicture?: string | null;
    isNewUser?: boolean;
    isVerified?: boolean;
}

export interface MoodEntry {
    id: string;
    mood: 'Happy' | 'Calm' | 'Tired' | 'Frustrated' | 'Sad' | 'Grateful';
    activities: string[];
    note: string;
    date: Date;
    tags?: string[];
}

export interface Habit {
    id: string;
    name: string;
    completed: boolean;
    streak?: number;
    streakGoal?: number;
    icon?: string;
    color?: string;
}

export interface HabitReminder {
    enabled: boolean;
    time: string;
    habitsToRemind: string[]; // array of habit IDs
    frequency: 'Daily' | 'Weekdays' | 'Weekends';
}

export interface NotificationSetting {
    enabled: boolean;
    time: string;
    daysBefore: number;
    method: 'In-App' | 'Email' | 'Both';
};


export interface JournalEntry {
    id:string;
    title?: string;
    content: string;
    date: Date;
    linkedMood?: 'Happy' | 'Calm' | 'Tired' | 'Frustrated' | 'Sad' | 'Grateful';
    tags?: string[];
    media?: { // Deprecated: kept for migration support
        type: 'image' | 'video';
        url: string; 
    };
    attachments?: {
        type: 'image' | 'video';
        url: string;
    }[];
}

export interface SleepEntry {
    id: string;
    date: Date; // The date the sleep session ended (usually "today")
    bedTime: string; // HH:mm format
    wakeTime: string; // HH:mm format
    durationHours: number;
    quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    notes?: string;
}

// Renamed PeriodDay to be more generic, though it's not used by the new tracker.
export interface CalendarDay {
    date: Date;
    isPeriod: boolean;
    isOvulation: boolean;
}

export interface Cycle {
  id: string;
  startDate: string; // ISO string YYYY-MM-DD
  length: number; // duration of the period in days
}

export type PeriodFlow = 'Spotting' | 'Light' | 'Medium' | 'Heavy';

export interface DayLog {
  flow: PeriodFlow | null;
  symptoms: string[];
  notes?: string;
  // Advanced Tracking
  cervicalMucus?: 'Dry' | 'Sticky' | 'Creamy' | 'Watery' | 'Eggwhite' | null;
  cervicalPosition?: 'Low' | 'Medium' | 'High' | null;
  basalBodyTemp?: string; // string to handle input easier, parsed when needed
  energyLevel?: 'Low' | 'Medium' | 'High' | null;
  periodColor?: 'Black' | 'Brown' | 'Dark Red' | 'Bright Red' | 'Pink' | 'Orange' | 'Gray' | null;
  mood?: 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Irritable' | 'Calm' | null;
}

export interface GardenDecor {
    activeBackground: string;
}
