
import React, { useMemo } from 'react';
import { Habit, GardenDecor } from '../types';
import {
    SeedlingStageIcon, SproutStageIcon, FlowerBudStageIcon, BloomingFlowerStageIcon, SunflowerStageIcon,
    TrophyIcon, LockIcon, CheckIcon,
    SunriseBgIcon, NightSkyBgIcon
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

interface GardenScreenProps {
    habits: Habit[];
    gardenDecor: GardenDecor;
    onDecorChange: (newDecor: GardenDecor) => void;
    gardenXp: number;
}

const GardenScreen: React.FC<GardenScreenProps> = ({ habits, gardenDecor, onDecorChange, gardenXp }) => {
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

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header Standardized */}
            <div>
                <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Your Garden</h2>
                <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">A visual reflection of your inner growth.</p>
            </div>

            {/* Garden Preview Standardized Header Overlay */}
            <div className={`rounded-[3rem] shadow-2xl p-8 text-center transition-all duration-700 ${activeBgClass} border-4 border-white dark:border-slate-800 min-h-[350px] flex flex-col justify-center items-center`}>
                <div className="flex justify-center items-center h-56 w-full">
                    <currentLevelData.Icon className="h-48 w-48 drop-shadow-2xl animate-float"/>
                </div>
                <h3 className="text-3xl font-bold font-serif text-white mt-6 drop-shadow-md">Level {currentLevelData.level}: {currentLevelData.name}</h3>
                <p className="text-sm font-sans font-bold text-white/80 uppercase tracking-widest mt-2 drop-shadow-sm">{xp} TOTAL XP EARNED</p>
                
                {nextLevelData && (
                     <div className="mt-8 w-full max-w-sm mx-auto px-4">
                        <div className="w-full bg-black/10 backdrop-blur-sm rounded-full h-3 p-0.5 border border-white/20">
                            <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-[10px] font-bold font-sans text-white mt-3 uppercase tracking-widest">
                            {Math.floor(progressPercent)}% TO NEXT STAGE
                        </p>
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
                        <div key={habit.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-bold font-sans text-gray-600 dark:text-slate-300 text-xs uppercase tracking-widest truncate mr-2">{habit.name}</p>
                                <p className="font-serif font-bold text-[#E18AAA] text-xl">{habit.streak || 0}</p>
                            </div>
                             <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                                <div className="bg-[#A7D7C5] h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${Math.min(((habit.streak || 0) / 10) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default GardenScreen;
