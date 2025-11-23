import React, { useMemo } from 'react';
import { Habit, GardenDecor } from '../types';
import {
    SeedlingStageIcon, SproutStageIcon, FlowerBudStageIcon, BloomingFlowerStageIcon, SunflowerStageIcon,
    TrophyIcon, LockIcon, CheckIcon,
    DefaultPotIcon, ClayPotIcon, PatternedPotIcon, GildedPotIcon,
    SunriseBgIcon, NightSkyBgIcon
} from './icons';

// --- GARDEN CONFIGURATION ---
const gardenLevels = [
    { level: 1, name: 'Seedling', xpRequired: 0, Icon: SeedlingStageIcon },
    { level: 2, name: 'Sprout', xpRequired: 10, Icon: SproutStageIcon },
    { level: 3, name: 'Flower Bud', xpRequired: 30, Icon: FlowerBudStageIcon },
    { level: 4, name: 'Blooming', xpRequired: 60, Icon: BloomingFlowerStageIcon },
    { level: 5, name: 'Sunflower', xpRequired: 100, Icon: SunflowerStageIcon },
];

const gardenPots = [
    { id: 'Default', name: 'Default Pot', unlockLevel: 1, Icon: DefaultPotIcon, Render: ({ children }: { children: React.ReactNode }) => <div className="w-24 h-20 bg-gray-400 rounded-b-xl rounded-t-sm flex items-center justify-center">{children}</div> },
    { id: 'Clay', name: 'Clay Pot', unlockLevel: 2, Icon: ClayPotIcon, Render: ({ children }: { children: React.ReactNode }) => <div className="w-28 h-24 bg-[#E29A68] rounded-b-2xl rounded-t-md flex items-center justify-center" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }}>{children}</div> },
    { id: 'Patterned', name: 'Patterned Pot', unlockLevel: 3, Icon: PatternedPotIcon, Render: ({ children }: { children: React.ReactNode }) => <div className="w-24 h-20 bg-blue-100 rounded-b-xl rounded-t-sm flex items-center justify-center relative overflow-hidden"><div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, #60A5FA, #60A5FA 10px, transparent 10px, transparent 20px)'}}></div>{children}</div> },
    { id: 'Gilded', name: 'Gilded Pot', unlockLevel: 5, Icon: GildedPotIcon, Render: ({ children }: { children: React.ReactNode }) => <div className="w-24 h-20 bg-white rounded-b-xl flex items-center justify-center border-b-4 border-x-2 border-gray-300 relative"><div className="absolute top-0 left-0 right-0 h-4 bg-yellow-400 rounded-t-sm"></div>{children}</div> },
];

const gardenBackgrounds = [
    { id: 'Sunrise', name: 'Sunrise', unlockLevel: 1, Icon: SunriseBgIcon, className: 'bg-gradient-to-br from-yellow-200 via-pink-200 to-rose-300' },
    { id: 'NightSky', name: 'Night Sky', unlockLevel: 4, Icon: NightSkyBgIcon, className: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' },
];

// --- COMPONENT PROPS ---
interface GardenScreenProps {
    habits: Habit[];
    gardenDecor: GardenDecor;
    onDecorChange: (newDecor: GardenDecor) => void;
    gardenXp: number;
}

// --- MAIN COMPONENT ---
const GardenScreen: React.FC<GardenScreenProps> = ({ habits, gardenDecor, onDecorChange, gardenXp }) => {
    // --- DATA CALCULATION ---
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
    
    const ActivePot = gardenPots.find(p => p.id === gardenDecor.activePot)?.Render || gardenPots[0].Render;
    const activeBgClass = gardenBackgrounds.find(b => b.id === gardenDecor.activeBackground)?.className || gardenBackgrounds[0].className;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>Your Garden</h2>
                <p className="text-[#8D7F85] dark:text-slate-400">Watch your wellness journey bloom</p>
            </div>

            <div className={`rounded-2xl shadow-lg p-6 text-center transition-colors duration-500 ${activeBgClass}`}>
                <div className="flex justify-center items-end h-32">
                    <ActivePot children={
                         <currentLevelData.Icon className="h-24 w-24 text-green-600 drop-shadow-lg"/>
                    }/>
                </div>
                <h3 className="text-xl font-bold text-white mt-4 drop-shadow-md">Garden Level {currentLevelData.level}</h3>
                <p className="text-white/80 drop-shadow-md">{currentLevelData.name}</p>
                <p className="text-sm text-white font-medium mt-4 drop-shadow-md">You've earned {xp} XP</p>
                
                {nextLevelData && (
                     <div className="mt-4">
                        <div className="w-full bg-black/20 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-white/90 to-white/60 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-white/80 mt-1 text-right">{Math.floor(progressPercent)}% to level {nextLevelData.level}</p>
                    </div>
                )}
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4">Customize Your Garden</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">Pots</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {gardenPots.map(pot => {
                                const isUnlocked = currentLevelData.level >= pot.unlockLevel;
                                const isActive = gardenDecor.activePot === pot.id;
                                return (
                                    <button 
                                        key={pot.id}
                                        disabled={!isUnlocked}
                                        onClick={() => onDecorChange({ ...gardenDecor, activePot: pot.id })}
                                        className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${isActive ? 'ring-2 ring-[#E18AAA] dark:ring-pink-500 border-transparent' : 'border-gray-200 dark:border-slate-700'} ${!isUnlocked ? 'bg-gray-100 dark:bg-slate-700/30' : 'bg-white dark:bg-slate-700/50 hover:shadow-md dark:hover:bg-slate-700'}`}
                                    >
                                        <pot.Icon className={`w-10 h-10 ${isUnlocked ? '' : 'opacity-40'}`} />
                                        <p className={`text-xs mt-1 font-medium ${isUnlocked ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>{pot.name}</p>
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-black/20 rounded-lg flex flex-col items-center justify-center text-white">
                                                <LockIcon className="w-5 h-5" />
                                                <span className="text-xs font-bold">Lvl {pot.unlockLevel}</span>
                                            </div>
                                        )}
                                        {isActive && <div className="absolute top-1 right-1 bg-[#E18AAA] text-white rounded-full p-0.5"><CheckIcon className="w-2.5 h-2.5" /></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">Backgrounds</h4>
                        <div className="grid grid-cols-4 gap-3">
                           {gardenBackgrounds.map(bg => {
                                const isUnlocked = currentLevelData.level >= bg.unlockLevel;
                                const isActive = gardenDecor.activeBackground === bg.id;
                                return (
                                    <button 
                                        key={bg.id}
                                        disabled={!isUnlocked}
                                        onClick={() => onDecorChange({ ...gardenDecor, activeBackground: bg.id })}
                                        className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${isActive ? 'ring-2 ring-[#E18AAA] dark:ring-pink-500 border-transparent' : 'border-gray-200 dark:border-slate-700'} ${!isUnlocked ? 'bg-gray-100 dark:bg-slate-700/30' : 'bg-white dark:bg-slate-700/50 hover:shadow-md dark:hover:bg-slate-700'}`}
                                    >
                                        <bg.Icon className={`w-10 h-10 rounded ${isUnlocked ? '' : 'opacity-40'}`} />
                                        <p className={`text-xs mt-1 font-medium ${isUnlocked ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>{bg.name}</p>
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-black/20 rounded-lg flex flex-col items-center justify-center text-white">
                                                <LockIcon className="w-5 h-5" />
                                                <span className="text-xs font-bold">Lvl {bg.unlockLevel}</span>
                                            </div>
                                        )}
                                        {isActive && <div className="absolute top-1 right-1 bg-[#E18AAA] text-white rounded-full p-0.5"><CheckIcon className="w-2.5 h-2.5" /></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-3">Garden Stages</h3>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 flex justify-around">
                   {gardenLevels.map(stage => (
                       <div key={stage.level} className="text-center">
                           <div className={`p-2 rounded-full ${currentLevelData.level === stage.level ? 'bg-pink-100 dark:bg-pink-900/40' : ''}`}>
                               <stage.Icon className={`w-10 h-10 transition-opacity ${currentLevelData.level >= stage.level ? 'opacity-100' : 'opacity-30'}`} />
                           </div>
                           <p className={`text-xs font-semibold mt-1 ${currentLevelData.level >= stage.level ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                               Level {stage.level}
                           </p>
                       </div>
                   ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-3">Habit Contributions</h3>
                <div className="grid grid-cols-2 gap-4">
                    {habits.map(habit => (
                        <div key={habit.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-gray-700 dark:text-slate-200">{habit.name}</p>
                                <p className="font-bold text-[#E18AAA] dark:text-pink-400 text-lg">{habit.streak || 0}</p>
                            </div>
                             <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                                <div className="bg-[#F4ABC4] dark:bg-pink-500 h-1.5 rounded-full" style={{ width: `${((habit.streak || 0) / (nextLevelData?.xpRequired || 10)) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GardenScreen;