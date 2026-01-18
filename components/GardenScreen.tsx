
import React, { useMemo, useState, useEffect } from 'react';
import { Habit, GardenDecor } from '../types';
import {
    SeedlingStageIcon, SproutStageIcon, FlowerBudStageIcon, BloomingFlowerStageIcon, SunflowerStageIcon,
    TrophyIcon, LockIcon, CheckIcon,
    SunriseBgIcon, NightSkyBgIcon, SparklesIcon
} from './icons';

const gardenLevels = [
    { level: 1, name: 'Seedling', xpRequired: 0, Icon: SeedlingStageIcon },
    { level: 2, name: 'Sprout', xpRequired: 10, Icon: SproutStageIcon },
    { level: 3, name: 'Flower Bud', xpRequired: 30, Icon: FlowerBudStageIcon },
    { level: 4, name: 'Blooming', xpRequired: 60, Icon: BloomingFlowerStageIcon },
    { level: 5, name: 'Sunflower', xpRequired: 100, Icon: SunflowerStageIcon },
];

const gardenBackgrounds = [
    { id: 'Sunrise', name: 'Sunrise', unlockLevel: 1, Icon: SunriseBgIcon, className: 'bg-gradient-to-br from-yellow-200 via-pink-200 to-rose-300' },
    { id: 'NightSky', name: 'Night', unlockLevel: 4, Icon: NightSkyBgIcon, className: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' },
];

// --- Decorative Particle Component ---
const GardenParticles: React.FC<{ type: 'petal' | 'star'; intensity: number }> = ({ type, intensity }) => {
    // Number of particles increases slightly with progress/intensity
    const count = Math.floor(10 + intensity * 10);
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`absolute animate-float-particle ${type === 'petal' ? 'text-pink-100/40' : 'text-yellow-100/40'}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${7 + Math.random() * 10}s`
                    }}
                >
                    {type === 'petal' ? (
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                         </svg>
                    ) : (
                        <SparklesIcon className="w-3 h-3" />
                    )}
                </div>
            ))}
        </div>
    );
};

interface GardenScreenProps {
    habits: Habit[];
    gardenDecor: GardenDecor;
    onDecorChange: (newDecor: GardenDecor) => void;
    gardenXp: number;
}

const GardenScreen: React.FC<GardenScreenProps> = ({ habits, gardenDecor, onDecorChange, gardenXp }) => {
    const [isWiggling, setIsWiggling] = useState(false);
    const [prevXp, setPrevXp] = useState(gardenXp);

    const gardenData = useMemo(() => {
        const xp = gardenXp;
        const currentLevelData = [...gardenLevels].reverse().find(l => xp >= l.xpRequired) || gardenLevels[0];
        const nextLevelData = gardenLevels.find(l => l.level === currentLevelData.level + 1);
        let progressPercent = 100;
        if (nextLevelData) {
            const xpForCurrentLevel = currentLevelData.xpRequired;
            const xpForNextLevel = nextLevelData.xpRequired;
            progressPercent = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
        }
        return { xp, currentLevelData, nextLevelData, progressPercent };
    }, [gardenXp]);

    const { currentLevelData, nextLevelData, progressPercent, xp } = gardenData;
    const activeBgClass = gardenBackgrounds.find(b => b.id === gardenDecor.activeBackground)?.className || gardenBackgrounds[0].className;

    // Trigger growth animation when XP increases
    useEffect(() => {
        if (gardenXp > prevXp) {
            setIsWiggling(true);
            setTimeout(() => setIsWiggling(false), 800);
            setPrevXp(gardenXp);
        }
    }, [gardenXp, prevXp]);

    const handlePlantClick = () => {
        setIsWiggling(true);
        if ('vibrate' in navigator) navigator.vibrate(10);
        setTimeout(() => setIsWiggling(false), 500);
    };

    // Calculate a subtle scale boost based on progress within the current level
    const growthScale = 1 + (progressPercent / 100) * 0.15;

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header Standardized */}
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Your Garden</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">A visual reflection of your inner growth.</p>
            </div>

            {/* Garden Preview with Enhanced Animations */}
            <div className={`rounded-[3rem] shadow-2xl p-8 text-center transition-all duration-1000 ${activeBgClass} border-4 border-white dark:border-slate-800 min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden`}>
                
                {/* Background Particles Intensity tied to progress */}
                <GardenParticles 
                    type={gardenDecor.activeBackground === 'NightSky' ? 'star' : 'petal'} 
                    intensity={progressPercent / 100} 
                />

                {/* Growth Glow Effect - intensifies as progress increases */}
                <div 
                    className="absolute w-64 h-64 bg-white/30 rounded-full blur-[80px] transition-all duration-1000 animate-pulse-slow"
                    style={{ 
                        opacity: 0.1 + (progressPercent / 300),
                        transform: `scale(${1 + (progressPercent / 200)})` 
                    }}
                ></div>

                <div 
                    className={`flex justify-center items-center h-64 w-full cursor-pointer relative z-10 transition-all duration-500 ${isWiggling ? 'animate-wiggle' : 'animate-float'}`}
                    style={{ transform: `scale(${growthScale})` }}
                    onClick={handlePlantClick}
                >
                    <currentLevelData.Icon className="h-48 w-48 drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] transition-transform duration-700"/>
                    
                    {/* Near Level-Up Sparkles */}
                    {progressPercent > 80 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SparklesIcon className="w-20 h-20 text-white animate-ping opacity-20" />
                        </div>
                    )}
                </div>

                <div className="relative z-10 mt-4">
                    <h3 className="text-3xl font-bold font-serif text-white drop-shadow-md">Level {currentLevelData.level}: {currentLevelData.name}</h3>
                    <p className="text-[10px] font-bold font-sans text-white/80 uppercase tracking-[0.3em] mt-2 drop-shadow-sm">{xp} TOTAL XP EARNED</p>
                </div>
                
                {nextLevelData && (
                     <div className="mt-8 w-full max-w-sm mx-auto px-4 relative z-10">
                        <div className="w-full bg-black/10 backdrop-blur-md rounded-full h-4 p-1 border border-white/20 shadow-inner overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-white/60 to-white h-full rounded-full transition-all duration-1000 relative" 
                                style={{ width: `${progressPercent}%` }}
                            >
                                {/* Progress Bar Shimmer */}
                                <div className="absolute top-0 right-0 h-full w-8 bg-white/40 blur-md animate-shimmer"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-[10px] font-bold font-sans text-white uppercase tracking-widest">
                                {Math.floor(progressPercent)}% BLOOMED
                            </p>
                            <p className="text-[10px] font-bold font-sans text-white/60 uppercase tracking-widest">
                                NEXT: {nextLevelData.name}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Standardized Card Header */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-lg p-8 border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-8">Customize Space</h3>
                <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4 block">Environments</p>
                        <div className="grid grid-cols-2 gap-4">
                           {gardenBackgrounds.map(bg => {
                                const isUnlocked = currentLevelData.level >= bg.unlockLevel;
                                const isActive = gardenDecor.activeBackground === bg.id;
                                return (
                                    <button 
                                        key={bg.id}
                                        disabled={!isUnlocked}
                                        onClick={() => onDecorChange({ ...gardenDecor, activeBackground: bg.id })}
                                        className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${isActive ? 'border-[#E18AAA] bg-pink-50/50 dark:bg-pink-900/20 shadow-inner' : 'border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-700/30 hover:border-pink-200'} ${!isUnlocked && 'opacity-40 grayscale cursor-not-allowed'}`}
                                    >
                                        <bg.Icon className="w-12 h-12 rounded-xl mb-3" />
                                        <span className="text-xs font-bold font-sans uppercase tracking-widest">{bg.name}</span>
                                        {!isUnlocked && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                                <LockIcon className="w-3 h-3 text-gray-400" />
                                                <span className="text-[8px] font-bold text-gray-400">LVL {bg.unlockLevel}</span>
                                            </div>
                                        )}
                                        {isActive && <CheckIcon className="absolute top-3 right-3 w-4 h-4 text-[#E18AAA]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Standardized Card Header */}
            <div>
                <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 mb-6">Habit Vitality</h3>
                <div className="grid grid-cols-2 gap-4">
                    {habits.map(habit => (
                        <div key={habit.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-bold font-sans text-gray-600 dark:text-slate-300 text-xs uppercase tracking-widest truncate mr-2">{habit.name}</p>
                                <p className="font-serif font-bold text-[#E18AAA] text-xl">{habit.streak || 0}</p>
                            </div>
                             <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#A7D7C5] h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${Math.min(((habit.streak || 0) / 10) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-8px) rotate(1deg); }
                    66% { transform: translateY(-4px) rotate(-1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes wiggle {
                    0% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.15) rotate(5deg); }
                    50% { transform: scale(1.1) rotate(-5deg); }
                    75% { transform: scale(1.15) rotate(2deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes float-particle {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translate(20px, -120px) rotate(360deg); opacity: 0; }
                }
                @keyframes pulse-slow {
                    0% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.05); opacity: 0.35; }
                    100% { transform: scale(1); opacity: 0.2; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-wiggle {
                    animation: wiggle 0.8s ease-in-out;
                }
                .animate-float-particle {
                    animation: float-particle linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-shimmer {
                    animation: shimmer 2.5s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default GardenScreen;
