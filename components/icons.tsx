
import React from 'react';

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

// --- NEW MOOD ICONS ---

export const HappyMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="happy-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FFECB3"/>
                <stop offset="100%" stopColor="#FFD54F"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#happy-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#F59E0B" strokeWidth="2"/>
        <path d="M46 38C46 38 41 48 32 48C23 48 18 38 18 38" stroke="#4B4246" strokeWidth="4.5" strokeLinecap="round"/>
        <g>
            <circle cx="24" cy="28" r="4" fill="#4B4246"/>
            <circle cx="25.5" cy="26.5" r="1.5" fill="white"/>
        </g>
        <g>
            <circle cx="40" cy="28" r="4" fill="#4B4246"/>
            <circle cx="41.5" cy="26.5" r="1.5" fill="white"/>
        </g>
    </svg>
);

export const CalmMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="calm-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#B2EBF2"/>
                <stop offset="100%" stopColor="#80DEEA"/>
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#calm-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#00ACC1" strokeWidth="2"/>
        <path d="M22 30C24 32 28 32 30 30" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M34 30C36 32 40 32 42 30" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M26 42C26 42 28.5 45 32 45C35.5 45 38 42 38 42" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

export const TiredMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <radialGradient id="tired-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#E8EAF6"/>
                <stop offset="100%" stopColor="#C5CAE9"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#tired-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#7986CB" strokeWidth="2"/>
        <path d="M44 42H20" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M18 28H30" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M34 28H46" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M18 34C21 32 27 32 30 34" stroke="#4B4246" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M34 34C37 32 43 32 46 34" stroke="#4B4246" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
);

export const FrustratedMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <radialGradient id="frustrated-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FFCCBC"/>
                <stop offset="100%" stopColor="#FF8A65"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#frustrated-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#E64A19" strokeWidth="2"/>
        <path d="M20 44C24 40 28 44 32 40C36 44 40 40 44 44" stroke="#4B4246" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M18 30L28 26" stroke="#4B4246" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M46 30L36 26" stroke="#4B4246" strokeWidth="4.5" strokeLinecap="round"/>
        <circle cx="26" cy="34" r="3" fill="#4B4246"/>
        <circle cx="38" cy="34" r="3" fill="#4B4246"/>
        <path d="M50 20L54 16" stroke="#E64A19" strokeWidth="3" strokeLinecap="round"/>
        <path d="M52 18L56 14" stroke="#E64A19" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

export const SadMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <radialGradient id="sad-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#BBDEFB"/>
                <stop offset="100%" stopColor="#64B5F6"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#sad-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#1976D2" strokeWidth="2"/>
        <path d="M18 44C18 44 23 36 32 36C41 36 46 44 46 44" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M22 28C22 30.2091 23.7909 32 26 32C28.2091 32 30 30.2091 30 28" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M34 28C34 30.2091 35.7909 32 38 32C40.2091 32 42 30.2091 42 28" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M44 34 C 44 38, 40 42, 40 42" stroke="#42A5F5" strokeWidth="4" strokeLinecap="round"/>
        <path d="M42 36 C 42 40, 38 44, 38 44" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

export const GratefulMoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
         <defs>
             <radialGradient id="grateful-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F8BBD0"/>
                <stop offset="100%" stopColor="#F06292"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#grateful-grad)"/>
        <circle cx="32" cy="32" r="28" stroke="#AD1457" strokeWidth="2"/>
        <path d="M44 40C44 40 39 48 32 48C25 48 20 40 20 40" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M22 28C24 26 28 26 30 28" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M34 28C36 26 40 26 42 28" stroke="#4B4246" strokeWidth="4" strokeLinecap="round"/>
        <path d="M17 32.5C17 30.567 18.567 29 20.5 29C22.433 29 24 30.567 24 32.5C24 36.5 19 39 19 39C19 39 17 36.5 17 32.5Z" fill="#EC407A"/>
        <path d="M47 32.5C47 30.567 45.433 29 43.5 29C41.567 29 40 30.567 40 32.5C40 36.5 45 39 45 39C45 39 47 36.5 47 32.5Z" fill="#EC407A"/>
    </svg>
);

// --- BRANDING ICONS ---
export const AnaraLogo: React.FC<IconProps> = ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="sakuraPetalGrad" cx="0.5" cy="0.5" r="0.65" fx="0.5" fy="0.8">
                <stop offset="0%" stopColor="#FFF1F2" /> 
                <stop offset="40%" stopColor="#FECDD3" /> 
                <stop offset="100%" stopColor="#FB7185" />
            </radialGradient>
            <radialGradient id="sakuraCenterGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <filter id="sakuraGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        <g filter="url(#sakuraGlow)">
             {/* 5-Petal Sakura Flower */}
            {[0, 72, 144, 216, 288].map((angle) => (
                <path
                    key={angle}
                    d="M50 50 C 30 35 15 15 35 6 Q 50 16 65 6 C 85 15 70 35 50 50" 
                    fill="url(#sakuraPetalGrad)"
                    stroke="#F43F5E"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    transform={`rotate(${angle} 50 50)`}
                />
            ))}
        </g>
        
        {/* Stamens */}
        <g>
             {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line 
                    key={angle}
                    x1="50" y1="50" x2="50" y2="34" 
                    stroke="#BE123C" 
                    strokeWidth="1" 
                    strokeLinecap="round"
                    transform={`rotate(${angle + 22.5} 50 50)`}
                    opacity="0.6"
                />
            ))}
             {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                 <circle
                    key={angle}
                    cx="50" cy="34" r="1.5"
                    fill="url(#sakuraCenterGrad)"
                    transform={`rotate(${angle + 22.5} 50 50)`}
                 />
            ))}
        </g>

        {/* Center */}
        <circle cx="50" cy="50" r="4" fill="#F43F5E" opacity="0.8" />
        <circle cx="50" cy="50" r="2" fill="#FFF1F2" />
    </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export const AppleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05 1.72-3.32 1.72s-1.68-.74-3.15-.74-1.88.72-3.13.74c-1.27.02-2.48-.9-3.53-2.42-2.14-3.1-2.14-6.9.04-9.35 1.08-1.22 2.5-1.95 3.84-1.95 1.34 0 2.22.75 3.32.75s1.7-.75 3.32-.75c1.1 0 2.24.5 3.06 1.43-2.6 1.58-2.18 5.3.45 6.64-.6 1.48-1.34 2.8-2.24 3.92zM12.03 7.25c-.02-2.43 2.02-4.5 4.38-4.75.25 2.45-2.22 4.63-4.38 4.75z"/>
    </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/>
    </svg>
);


export const PomegranateFruitIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M85 50C85 74.8528 64.8528 95 40 95C15.1472 95 -5 74.8528 -5 50C-5 25.1472 15.1472 5 40 5C64.8528 5 85 25.1472 85 50Z" fill="#F48FB1"/>
        <path d="M40 5C53.2548 5 65.4615 11.268 73.1371 20H90L95 30V70L90 80H73.1371C65.4615 88.732 53.2548 95 40 95" fill="#E18AAA"/>
        <circle cx="20" cy="30" r="5" fill="#AD1457"/>
        <circle cx="35" cy="25" r="6" fill="#F06292"/>
        <circle cx="50" cy="30" r="5" fill="#AD1457"/>
        <circle cx="25" cy="45" r="7" fill="#F06292"/>
        <circle cx="45" cy="45" r="8" fill="#AD1457"/>
        <circle cx="65" cy="48" r="6" fill="#F06292"/>
        <circle cx="30" cy="65" r="5" fill="#AD1457"/>
        <circle cx="50" cy="68" r="7" fill="#F06292"/>
        <circle cx="15" cy="60" r="4" fill="#F06292"/>
    </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z" />
        <rect x="5" y="5" width="4" height="4" stroke="none" fill="currentColor" opacity="0.3" />
    </svg>
);

export const MoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01M15 9h.01" />
    </svg>
);

export const HabitIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" opacity="0.2"></path>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

export const JournalIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6V18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H6C4.9 4 4 4.9 4 6z" stroke="none" fill="currentColor" opacity="0.1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4zM12 4v16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h3M8 12h4M8 15h2" opacity="0.6"/>
    </svg>
);

export const PeriodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 00-7.52 16.97A10 10 0 0012 22a10 10 0 009.25-6.96A10 10 0 0012 2z" opacity="0.3" fill="currentColor" stroke="none" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 00-7.52 16.97A10 10 0 0012 22a10 10 0 009.25-6.96" />
    </svg>
);

export const SleepTrackerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" fill="currentColor" opacity="0.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l2-2m-2 2l2 2m-2-2h-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 5l1-1m-1 1l1 1m-1-1h-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export const GardenIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8.25c-2.488 0-4.5 2.012-4.5 4.5s2.012 4.5 4.5 4.5 4.5-2.012 4.5-4.5-2.012-4.5-4.5-4.5z" stroke="none" fill="currentColor" opacity="0.2"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.375 2.625-5.625 6.125-5.625 10.125 0 3.038 2.487 5.5 5.5 5.5s5.5-2.462 5.5-5.5c0-4-2.25-7.5-5.375-10.125z" />
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const MenuGridIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

// --- PASSWORD VISIBILITY ICONS ---
export const EyeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

// --- Period Tracker Icons ---
export const CrampsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M10.5 19.5c-1.5-1.5-1.5-3-1.5-4.5 0-2 .5-3.5 1.5-5M13.5 19.5c1.5-1.5 1.5-3 1.5-4.5 0-2-.5-3.5-1.5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5c-1.5-1.5-1.5-3-1.5-4.5 0-2 .5-3.5 1.5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 19.5c1.5-1.5 1.5-3 1.5-4.5 0-2-.5-3.5-1.5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l-2 2 2 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 10l2 2-2 2" />
    </svg>
);
export const HeadacheIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l-1.5-1.5m7 7L14 14m-4 0l-1.5 1.5m7-7L14 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5V3m0 18v-2m-7-7H3m18 0h-2" />
    </svg>
);
export const BloatingIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M12 19a7 7 0 100-14 7 7 0 000 14z" strokeDasharray="3 3"/>
        <circle cx="12" cy="12" r="7" strokeDasharray="3 3"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V2m0 20v-1m-9-9H2m20 0h-1m-7.5-7.5L4 4m16 0l-1.5 1.5M4 20l1.5-1.5m13 0L17 17"/>
    </svg>
);
export const CravingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M2 14.5h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
        <path fill="currentColor" opacity="0.1" d="M12 11a4 4 0 01-4-4c0-2.5 1-4.5 4-4.5s4 2 4 4.5a4 4 0 01-4 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 01-4-4c0-2.5 1-4.5 4-4.5s4 2 4 4.5a4 4 0 01-4 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 14.5h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
    </svg>
);
export const MoodSwingIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M12 21a9 9 0 01-9-9" />
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h.01M16 9h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 15s1 2 4 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 15s-1-2-4-2" />
    </svg>
);
export const FatigueIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h15a2 2 0 012 2v2a2 2 0 01-2 2H2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 10v4" />
        <path fill="currentColor" opacity="0.3" d="M3 11h3v2H3z" />
    </svg>
);
export const AcneIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path fill="currentColor" d="M9 10a1 1 0 11-2 0 1 1 0 012 0zM17 11a1 1 0 11-2 0 1 1 0 012 0zM13 16a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);
export const BackPainIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11l-3 3-3-3" />
        <path fill="currentColor" opacity="0.2" d="M10 16h4v3h-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 16h4" />
    </svg>
);
export const NauseaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 15c1-1 2-1 3 0s2 1 3 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01M15 9h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.5a1 1 0 000-2" opacity="0.5"/>
    </svg>
);

// --- NEW PHASE ICONS ---
export const MenstrualPhaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M12 21.35c-3.6-3.6-6-7.6-6-10.85A6 6 0 0112 4.5a6 6 0 016 6c0 3.25-2.4 7.25-6 10.85z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35c-3.6-3.6-6-7.6-6-10.85A6 6 0 0112 4.5a6 6 0 016 6c0 3.25-2.4 7.25-6 10.85z"/>
    </svg>
);
export const FollicularPhaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M17 14a5 5 0 01-10 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14a5 5 0 01-10 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 01-3-3c0-2 3-3 3-3s3 1 3 3a3 3 0 01-3 3z" />
    </svg>
);
export const OvulationPhaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m-7.07-7.07l-1.42-1.42M19.07 4.93l-1.42 1.42M2 12h2m16 0h2m-2.93 7.07l-1.42-1.42M4.93 4.93l1.42 1.42"/>
    </svg>
);
export const LutealPhaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.2" d="M12 21a9 9 0 110-18v18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18v18z" />
    </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

// --- New Activity & Habit Icons ---
export const ReadingIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
export const ExerciseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M13 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L12 12l-2.25 2.25m-4.5 3.75l4.5-4.5 2.25-2.25 2.25-2.25 4.5 4.5M6 21l4.5-4.5" />
    </svg>
);
export const MeditationIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 0a2 2 0 104 0 2 2 0 00-4 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5c-2.5 0-5-1-5-2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14c0 1.5-2.5 2.5-5 2.5" />
    </svg>
);
export const SocializingIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M21 11.25c0 .774-.298 1.493-.781 2.016L18 16.5h-3.375a1.125 1.125 0 01-1.125-1.125V11.25a3.375 3.375 0 013.375-3.375H21zM3 5.25a3.375 3.375 0 013.375-3.375h1.5c1.72 0 3.125 1.405 3.125 3.125v3.375c0 .621-.504 1.125-1.125 1.125H9.375l-4.781 3.25V5.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25c0 .774-.298 1.493-.781 2.016L18 16.5h-3.375a1.125 1.125 0 01-1.125-1.125V11.25a3.375 3.375 0 013.375-3.375H21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.25a3.375 3.375 0 013.375-3.375h1.5c1.72 0 3.125 1.405 3.125 3.125v3.375c0 .621-.504 1.125-1.125 1.125H9.375l-4.781 3.25V5.25z" />
    </svg>
);
export const CreativeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M12 2.25c-3.866 0-7 2.015-7 5.25 0 2.062 1.334 3.655 3.14 4.582V15a.75.75 0 00.75.75h6.22a.75.75 0 00.75-.75v-2.918c1.806-.927 3.14-2.52 3.14-4.582 0-3.235-3.134-5.25-7-5.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-3.866 0-7 2.015-7 5.25 0 2.062 1.334 3.655 3.14 4.582V15a.75.75 0 00.75.75h6.22a.75.75 0 00.75-.75v-2.918c1.806-.927 3.14-2.52 3.14-4.582 0-3.235-3.134-5.25-7-5.25zM9 18h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a1.5 1.5 0 01-1.5-1.5v-1.5a1.5 1.5 0 013 0v1.5a1.5 1.5 0 01-1.5 1.5z" />
    </svg>
);
export const WorkIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5zM9 5.25V4.5a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v.75" />
    </svg>
);
export const RestIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M11.25 3.375c-6.175 4.25-6.175 12.25 0 16.5 3.821-2.997 3.821-13.503 0-16.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.375c-6.175 4.25-6.175 12.25 0 16.5 3.821-2.997 3.821-13.503 0-16.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);
export const NatureIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path fill="currentColor" opacity="0.1" d="M13.5 3c-4.5 4.5-3 10.5 1.5 15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3c-4.5 4.5-3 10.5 1.5 15M10.5 21c4.5-4.5 3-10.5-1.5-15" />
    </svg>
);

export const MediaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

// --- Garden Screen Icons ---
export const TrophyIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);
export const LockIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
export const SeedlingStageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.333 46H26.6663C25.1936 46 24 44.8064 24 43.3337V43.3337C24 41.861 25.1936 40.6673 26.6663 40.6673H37.333C38.8057 40.6673 39.9993 41.861 39.9993 43.3337V43.3337C39.9993 44.8064 38.8057 46 37.333 46Z" fill="#A16207"/>
        <path d="M32 41C32 41 32 32.3333 41.3333 22.6667" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 41C32 41 32 32.3333 22.6667 22.6667" stroke="#84CC16" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);
export const SproutStageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 48V28" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 36C22.6667 36 22.6667 24 32 24C22.6667 24 28 16 32 24" fill="#84CC16"/>
        <path d="M32 36C41.3333 36 41.3333 24 32 24C41.3333 24 36 16 32 24" fill="#A3E635"/>
    </svg>
);
export const FlowerBudStageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 50V30" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 30C26.4772 30 22 25.5228 22 20C22 14.4772 26.4772 10 32 10C37.5228 10 42 14.4772 42 20C42 25.5228 37.5228 30 32 30Z" fill="#F9A8D4"/>
        <path d="M26 34C28 32 30 30 32 30" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
    </svg>
);
export const BloomingFlowerStageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 50V34" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 24C32 24 24 12 16 20C8 28 20 36 32 24Z" fill="#F472B6"/>
        <path d="M32 24C32 24 40 12 48 20C56 28 44 36 32 24Z" fill="#EC4899"/>
        <path d="M32 24C20 24 12 32 20 40C28 48 32 36 32 24Z" fill="#EC4899"/>
        <path d="M32 24C44 24 52 32 44 40C36 48 32 36 32 24Z" fill="#F472B6"/>
        <circle cx="32" cy="24" r="4" fill="#FBBF24"/>
    </svg>
);
export const SunflowerStageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 52V36" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 26C32 26 22 14 14 22C6 30 20 38 32 26Z" fill="#F59E0B"/>
        <path d="M32 26C32 26 42 14 50 22C58 30 44 38 32 26Z" fill="#FBBF24"/>
        <path d="M32 26C18 26 10 34 18 42C26 50 32 38 32 26Z" fill="#FBBF24"/>
        <path d="M32 26C46 26 54 34 46 42C38 50 32 38 32 26Z" fill="#F59E0B"/>
        <circle cx="32" cy="26" r="6" fill="#A16207"/>
    </svg>
);

export const DefaultPotIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" fill="#BFBFBF" xmlns="http://www.w3.org/2000/svg"><path d="M14 20H50L46 56H18L14 20Z"/></svg>);
export const ClayPotIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" fill="#E29A68" xmlns="http://www.w3.org/2000/svg"><path d="M12 18H52L48 58H16L12 18Z"/></svg>);
export const PatternedPotIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" fill="#F0EAD6" xmlns="http://www.w3.org/2000/svg"><path d="M14 20H50L46 56H18L14 20Z"/><path d="M22 30L26 38L30 30" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M34 30L38 38L42 30" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
export const GildedPotIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 24H50L46 60H18L14 24Z" fill="white"/><path d="M12 16H52V24H12V16Z" fill="#FFD700"/></svg>);

export const SunriseBgIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="url(#sunrise-grad)"/><defs><linearGradient id="sunrise-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop stopColor="#FDE68A"/><stop offset="1" stopColor="#F4ABC4"/></linearGradient></defs></svg>);
export const NightSkyBgIcon: React.FC<IconProps> = ({ className }) => ( <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="url(#night-grad)"/><circle cx="16" cy="8" r="1" fill="white"/><circle cx="18" cy="14" r="1" fill="white" opacity="0.7"/><defs><linearGradient id="night-grad" x1="0.5" y1="0" x2="0.5" y2="1"><stop stopColor="#4C1D95"/><stop offset="1" stopColor="#818CF8"/></linearGradient></defs></svg>);

// --- New Habit Icons ---
export const WaterDropIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z" />
    </svg>
);
export const BedIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 9.5v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9.5V6a2 2 0 012-2h12a2 2 0 012 2v3.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 9h10" />
    </svg>
);
// Renamed from AppleIcon to AppleFruitIcon to avoid conflict with the brand logo AppleIcon
export const AppleFruitIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35a9.002 9.002 0 005.41-1.782c1.94-1.35 2.924-3.8 2.57-6.02-.354-2.22-1.89-4.14-3.79-5.22a9.01 9.01 0 00-12.38 0c-1.9 1.08-3.436 3-3.79 5.22-.354 2.22.63 4.67 2.57 6.02A9.002 9.002 0 0012 21.35z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 4.5a2.5 2.5 0 00-5 0" />
    </svg>
);
export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5L12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20l1-2.5L8.5 19l-2.5 1L5 20z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 5l-1 2.5-2.5-1L17 5l-1-2.5 2.5 1L19 5z" />
    </svg>
);
export const BrainIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.5-1 3-2.5 3.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 16.5c-1.5-.5-2.5-2-2.5-3.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.5c-1.5-.5-2.5-2-2.5-3.5C6.5 8.5 8.5 6.5 11 6.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 6.5c2.5 0 4.5 2 4.5 4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 19c-2 0-3-2-3-4s1-4 3-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 19c2 0 3-2 3-4s-1-4-3-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3" />
    </svg>
);

// --- New Settings Icons ---
export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

// --- New Period Tracker Suggestion Icons ---
export const DzikirIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8h-4a8 8 0 01-8-8v0z" />
        <circle cx="16" cy="12" r="2" fill="currentColor" opacity="0.4"/>
        <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.4"/>
        <circle cx="7" cy="15" r="1" fill="currentColor" opacity="0.4"/>
    </svg>
);
export const MurajaahIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
export const DuaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.5a3.5 3.5 0 014.38 3.06" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5.5a3.5 3.5 0 00-4.38 3.06" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.06 8.56a3.5 3.5 0 014.88 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 13.5v7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 13.5v7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 20.5h8" />
    </svg>
);
export const ListenIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.115 10.638A8.5 8.5 0 005.47 4.097M19.115 10.638V18a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3.362m-7.23 4.265A8.5 8.5 0 0118.53 19.9M4.885 13.362A8.5 8.5 0 0118.53 19.9m0-15.803A8.5 8.5 0 005.47 4.097m4.42 12.138a2 2 0 002.04-1.548 2 2 0 00-1.548-2.04m-3.08 3.08a2 2 0 001.548-2.04 2 2 0 00-2.04-1.548" />
    </svg>
);
export const GentleExerciseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="5" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-3 7h6l-3-7z" />
    </svg>
);
export const SupplementIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3m-1.5-1.5h3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.79l-4.5 4.5a3.75 3.75 0 105.3 5.3l4.5-4.5a3.75 3.75 0 10-5.3-5.3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 19.21l4.5-4.5a3.75 3.75 0 11-5.3-5.3l-4.5 4.5a3.75 3.75 0 115.3 5.3z" />
    </svg>
);
export const AddIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);
export const MenuIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
export const MoonStarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
         <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
         <path d="M19 2L19.5 3.5L21 4L19.5 4.5L19 6L18.5 4.5L17 4L18.5 3.5L19 2Z" fill="currentColor"/>
    </svg>
);
export const SunIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

// --- NEW ICONS FOR HABIT TRACKER ---
export const WalkingIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM12.5 9l-2 2h-3l2 4 1.5 5.5M12.5 9l2.5 3 2 5" />
    </svg>
);
export const DumbbellIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7v10M3 9v6M21 9v6M18 7v10M6 12h12" />
    </svg>
);
export const YogaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a2 2 0 100-4 2 2 0 000 4zm-7 7.5c1 1 3 0 5-1.5s4-1 6 0 3.5 2.5 3.5 2.5M12 11v4l-4 3m8-3l4 3" />
    </svg>
);
export const CoffeeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1l.5 3M10 1l.5 3M14 1l.5 3" />
    </svg>
);
export const TeaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 12h2a3 3 0 010 6h-2M2 12h15v5a4 4 0 01-4 4H6a4 4 0 01-4-4v-5zM9 8v4" />
    </svg>
);
export const VeggieIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 15V6M6 12h12" />
    </svg>
);
export const FruitBowlIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12a10 10 0 0020 0H2zM12 5a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
);
export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
);
export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);
export const BrushIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 3c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM3 21l6-6m3-3l6-6" />
    </svg>
);
export const MusicIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
export const CodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
export const BagIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
export const HomeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
export const CatIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4 0-7-3-7-7s3-7 7-7 7 3 7 7-3 7-7 7zM9 7L6 3M15 7l3-4M12 11l.01-.01M9 14s1 1 3 1 3-1 3-1" />
    </svg>
);
export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="2" width="12" height="20" rx="3" ry="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
    </svg>
);

// --- NEW ICONS FOR SHARE & CLOSE ---
export const ShareIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- EDITOR ICONS ---
export const RotateLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v6M3 10l6 6m-6-6l6-6" />
    </svg>
);

export const CropIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" opacity="0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" opacity="0"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9H9a2 2 0 00-2 2v8a2 2 0 002 2zM3 7h10M21 17H11" />
    </svg>
);

export const WandIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- NEW SLEEP QUALITY ICONS ---

export const SleepExcellentIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21a9 9 0 1 0-8.354-5.646A9.003 9.003 0 0 1 15.354 3.646 9.003 9.003 0 0 0 12 21Z" fill="currentColor" opacity="0.8"/>
        <path d="M19 4l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5ZM16 9l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3.3-.9Z" fill="currentColor"/>
    </svg>
);

export const SleepGoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21a9 9 0 1 0-8.354-5.646A9.003 9.003 0 0 1 15.354 3.646 9.003 9.003 0 0 0 12 21Z" fill="currentColor" opacity="0.6"/>
        <path d="M18 6l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3.3-.9Z" fill="currentColor"/>
    </svg>
);

export const SleepFairIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 19a7 7 0 1 0-6.498-4.391A7.003 7.003 0 0 1 13.615 5.5 7.003 7.003 0 0 0 11 19Z" fill="currentColor" opacity="0.5"/>
        <path d="M13 14c-1.5 0-3 1-3 2.5s1.5 2.5 3 2.5h6c1.5 0 3-1 3-2.5S20.5 14 19 14h-6Z" fill="currentColor" opacity="0.3"/>
    </svg>
);

export const SleepPoorIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 14c-2 0-4 1.5-4 3.5S4 21 6 21h12c2 0 4-1.5 4-3.5S20 14 18 14h-12Z" fill="currentColor" opacity="0.4"/>
        <path d="M14 6h4v1.5h-2.5L18 9v1.5h-4V9h2.5L14 7.5V6Z" fill="currentColor" opacity="0.6"/>
    </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.66 11.5c-.21-.07-.41-.14-.61-.21C16.32 10.1 15 8.39 15 6.5c0-1.89 1.32-3.6 2.05-4.79.08-.13.01-.31-.15-.31-1.07.03-2.13.25-3.13.66-2.18.9-3.77 3-3.77 5.44 0 1.15.34 2.22.91 3.12-.57-.57-1.12-1.12-1.12-1.12s-3 3-3 7.5c0 3.87 3.13 7 7 7s7-3.13 7-7c0-.82-.14-1.61-.41-2.34-.05-.14-.2-.17-.29-.06-.52.51-1.1 1.02-1.63 1.54z"/>
    </svg>
);
