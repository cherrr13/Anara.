
import React, { useState, useMemo, useEffect } from 'react';
import { AnaraLogo, EyeIcon, EyeOffIcon, CheckIcon, XMarkIcon, WarningIcon, SparklesIcon } from '../icons';

interface SignUpScreenProps {
    onSignUp: (name: string, email: string, password?: string) => void;
    onSwitchToSignIn: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToSignIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Dynamic placeholders for multilingual welcoming
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholders = ["Your Name", "Nama Anda", "اسمك", "이름", "Dein Name"];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const requirements = useMemo(() => [
        { label: 'Length ≥ 10', met: password.length >= 10 },
        { label: 'Complexity (Aa1!)', met: /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) },
        { label: 'Identity Match', met: password === confirmPassword && confirmPassword !== '' },
    ], [password, confirmPassword]);

    const strength = useMemo(() => {
        let s = 0;
        if (password.length > 0) s += 20;
        if (password.length >= 10) s += 20;
        if (/[A-Z]/.test(password)) s += 20;
        if (/[0-9]/.test(password)) s += 20;
        if (/[^A-Za-z0-9]/.test(password)) s += 20;
        return s;
    }, [password]);

    const isReady = requirements.every(r => r.met) && name.trim().length > 1 && email.includes('@');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!isReady) {
            setError("Please finalize all spiritual security markers and ensure a valid email.");
            if ('vibrate' in navigator) navigator.vibrate([40, 40, 40]);
            return;
        }

        // Local check for existing user
        const db = JSON.parse(localStorage.getItem('anaraAuthDB') || '[]');
        if (db.some((u: any) => u.email.toLowerCase() === email.toLowerCase().trim())) {
            setError("This soul already exists in our sanctuary. Please sign in.");
            if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
            return;
        }

        setIsLoading(true);
        // Direct transition to onboarding
        setTimeout(() => {
            onSignUp(name.trim(), email.toLowerCase().trim(), password);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] via-[#FCE7F3] to-[#E0D9FE] dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col justify-center items-center p-6 animate-fade-in">
            <div className="w-full max-w-sm relative">
                <div className="text-center mb-8 relative z-10">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-3xl shadow-lg inline-block mb-4 border border-white/50 dark:border-slate-700 animate-float">
                        <AnaraLogo className="h-12 w-12 text-[#F4ABC4]"/>
                    </div>
                    <h1 className="text-3xl font-bold text-[#4B4246] dark:text-slate-100 font-serif">Begin Journey</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-xs font-medium tracking-wide">Plant your seeds in a verified sanctuary.</p>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 border border-white dark:border-slate-700/50 relative z-10">
                    <form onSubmit={handleSignUp} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl text-[10px] font-bold text-center border border-rose-100 dark:border-rose-800/50 animate-pop flex items-center gap-2">
                                <WarningIcon className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Preferred Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={placeholders[placeholderIndex]}
                                className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none text-sm shadow-inner"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Email Connection</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@gmail.com"
                                className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none text-sm shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Spirit Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none pr-12 text-sm shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-[#E18AAA]"
                                >
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Strength Meter */}
                            <div className="h-1 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-700 ${strength < 40 ? 'bg-rose-400' : strength < 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                    style={{ width: `${strength}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Confirm Identity</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border rounded-xl focus:ring-4 transition-all dark:text-slate-100 outline-none text-sm shadow-inner ${password !== '' && confirmPassword !== '' ? (password === confirmPassword ? 'border-emerald-200 ring-emerald-50' : 'border-rose-200 ring-rose-50') : 'border-gray-100 dark:border-slate-700'}`}
                            />
                        </div>

                        <div className="p-4 bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-2 shadow-inner">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] font-bold">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                                        <CheckIcon className={`w-2.5 h-2.5 ${req.met ? 'text-white' : 'text-gray-400'}`} />
                                    </div>
                                    <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500'}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={!isReady || isLoading}
                            className="w-full bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] text-white font-bold py-4 rounded-2xl shadow-xl hover:brightness-110 transition-all active:scale-95 text-[10px] uppercase tracking-[0.3em] disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                             {isLoading ? (
                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                             ) : <SparklesIcon className="w-4 h-4" />}
                             {isLoading ? 'Cultivating...' : 'Begin Journey'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
                    Returning Friend?{' '}
                    <button onClick={onSwitchToSignIn} className="text-[#E18AAA] dark:text-pink-400 hover:underline">
                        Enter Here
                    </button>
                </p>
            </div>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SignUpScreen;
