
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
            <linearGradient id="petalGradient" x1="50" y1="50" x2="50" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FCE7F3" />
                <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        <g filter="url(#glow)">
             {/* 5-Petal Flower */}
            {[0, 72, 144, 216, 288].map((angle) => (
                <path
                    key={angle}
                    d="M50 50 Q35 25 50 5 Q65 25 50 50"
                    fill="url(#petalGradient)"
                    stroke="#FBCFE8"
                    strokeWidth="1"
                    transform={`rotate(${angle} 50 50)`}
                    opacity="0.9"
                />
            ))}
            {/* Inner Petals for depth */}
             {[36, 108, 180, 252, 324].map((angle) => (
                <path
                    key={angle}
                    d="M50 50 Q40 35 50 25 Q60 35 50 50"
                    fill="#F9A8D4"
                    transform={`rotate(${angle} 50 50)`}
                    opacity="0.7"
                />
            ))}
        </g>
        
        {/* Center */}
        <circle cx="50" cy="50" r="6" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2" />
        <circle cx="50" cy="50" r="3" fill="#F472B6" />
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
export const AppleIcon: React.FC<IconProps> = ({ className }) => (
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