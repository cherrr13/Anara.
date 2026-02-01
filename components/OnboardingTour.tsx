
import React, { useState, useEffect, useCallback } from 'react';
import { 
    AnaraLogo, SparklesIcon, HabitIcon, GardenIcon, CheckIcon, 
    MenuIcon, UserIcon, MoodIcon, JournalIcon, PeriodIcon, SleepTrackerIcon 
} from './icons';
import { User, Tab } from '../types';

interface OnboardingTourProps {
    user: User | null;
    onComplete: () => void;
}

interface TourStep {
    title: string;
    description: string;
    targetId?: string;
    selector?: string; // Fallback for elements without IDs
    icon: React.ReactNode;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ user, onComplete }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [coords, setCoords] = useState<{ x: number, y: number, r: number }>({ x: 0, y: 0, r: 0 });

    const steps: TourStep[] = [
        {
            title: `Welcome, ${user?.name || 'Soul'}`,
            description: "Step into your digital sanctuary. Anara is designed to nurture your nature and guide you toward inner blooming.",
            icon: <AnaraLogo className="w-12 h-12" />
        },
        {
            title: "Quick Access Menu",
            description: "Tap here to view all sections of Anara at a glance and navigate your sanctuary with ease.",
            selector: "header button:first-child",
            icon: <MenuIcon className="w-12 h-12" />
        },
        {
            title: "Profile & Settings",
            description: "Personalize your experience, toggle Dark Mode, or enable spiritual guidance features here.",
            selector: "header button:last-child",
            icon: <UserIcon className="w-12 h-12" />
        },
        {
            title: "Mood Lab",
            description: "Capture your emotional vibrations. Tracking how you feel helps identify patterns in your well-being.",
            targetId: `nav-btn-${Tab.Mood}`,
            icon: <MoodIcon className="w-12 h-12" />
        },
        {
            title: "Daily Rituals",
            description: "Consistency is the water for your growth. Track your habits and watch resilience flourish.",
            targetId: `nav-btn-${Tab.Habit}`,
            icon: <HabitIcon className="w-12 h-12" />
        },
        {
            title: "Inner Sanctuary",
            description: "Your digital journal. Reflect on prompts or capture spontaneous thoughts to clear your mind.",
            targetId: `nav-btn-${Tab.Journal}`,
            icon: <JournalIcon className="w-12 h-12" />
        },
        {
            title: "Body Wellness",
            description: "Keep track of your physical cycles and receive AI-powered insights for hormonal health.",
            targetId: `nav-btn-${Tab.Period}`,
            icon: <PeriodIcon className="w-12 h-12" />
        },
        {
            title: "Rest & Recovery",
            description: "Nurture the quiet hours. Log your sleep to understand the depth of your restoration.",
            targetId: `nav-btn-${Tab.Sleep}`,
            icon: <SleepTrackerIcon className="w-12 h-12" />
        },
        {
            title: "Your Evolving Garden",
            description: "Your progress isn't just data—it's a living Sakura tree. As you bloom, so does your garden.",
            targetId: `nav-btn-${Tab.Garden}`,
            icon: <GardenIcon className="w-12 h-12" />
        },
        {
            title: "Meet Nara",
            description: "Your AI companion is always a tap away. Ask for a story, consultation, or just someone to listen.",
            targetId: 'nara-trigger-btn',
            icon: <SparklesIcon className="w-12 h-12" />
        },
        {
            title: "Your Journey Begins",
            description: "May every petal you plant bring you closer to peace. Your sanctuary is now open.",
            icon: <CheckIcon className="w-12 h-12" />
        }
    ];

    const updateSpotlight = useCallback(() => {
        const step = steps[stepIndex];
        if (step.targetId || step.selector) {
            const el = step.targetId 
                ? document.getElementById(step.targetId) 
                : document.querySelector(step.selector!);
                
            if (el) {
                const rect = el.getBoundingClientRect();
                setCoords({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    r: Math.max(rect.width, rect.height) / 2 + 10
                });
                return;
            }
        }
        // Fallback to center/hidden spotlight
        setCoords({ x: 0, y: 0, r: 0 });
    }, [stepIndex]);

    useEffect(() => {
        updateSpotlight();
        window.addEventListener('resize', updateSpotlight);
        return () => window.removeEventListener('resize', updateSpotlight);
    }, [updateSpotlight]);

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
            if ('vibrate' in navigator) navigator.vibrate(10);
        } else {
            onComplete();
        }
    };

    const currentStep = steps[stepIndex];
    const isFloatingStep = coords.r > 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in pointer-events-none">
            {/* Dynamic Spotlight Layer */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] transition-all duration-500 pointer-events-auto"
                style={{
                    maskImage: isFloatingStep 
                        ? `radial-gradient(circle ${coords.r}px at ${coords.x}px ${coords.y}px, transparent 100%, black 100%)`
                        : 'none',
                    WebkitMaskImage: isFloatingStep 
                        ? `radial-gradient(circle ${coords.r}px at ${coords.x}px ${coords.y}px, transparent 100%, black 100%)`
                        : 'none',
                }}
            ></div>

            {/* Content Card */}
            <div 
                className={`pointer-events-auto w-full max-w-sm mx-4 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl p-8 border border-white/20 transform transition-all duration-500 animate-pop relative z-10 ${
                    isFloatingStep && coords.y > window.innerHeight / 2 ? 'mb-40' : 
                    isFloatingStep && coords.y <= window.innerHeight / 2 ? 'mt-40' : ''
                }`}
            >
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="bg-sakura-50 dark:bg-slate-700 p-5 rounded-[2rem] shadow-inner text-sakura-500">
                        {currentStep.icon}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold font-serif text-gray-800 dark:text-slate-100 leading-tight">
                            {currentStep.title}
                        </h3>
                        <p className="text-sm font-sans text-gray-500 dark:text-slate-400 leading-relaxed">
                            {currentStep.description}
                        </p>
                    </div>

                    <div className="w-full flex items-center justify-between gap-4 pt-4">
                        <div className="flex gap-1.5 flex-1 overflow-hidden">
                            {steps.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                                        i === stepIndex ? 'w-6 bg-sakura-500' : 'w-1.5 bg-gray-200 dark:bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={handleNext}
                            className="bg-sakura-500 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-sakura-200 dark:shadow-none hover:bg-sakura-600 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {stepIndex === steps.length - 1 ? 'Start Journey' : 'Next'}
                        </button>
                    </div>
                </div>

                {/* Arrow Pointer for Spotlights */}
                {isFloatingStep && (
                    <div 
                        className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-white/20 shadow-xl transition-all duration-500 ${
                            coords.y > window.innerHeight / 2 ? 'bottom-[-8px]' : 'top-[-8px] rotate-[225deg]'
                        }`}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default OnboardingTour;
