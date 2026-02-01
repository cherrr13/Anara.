
import React, { useState } from 'react';
import { AnaraLogo, EyeIcon, EyeOffIcon, GoogleIcon, AppleIcon, FacebookIcon, CheckIcon, WarningIcon } from '../icons';

interface SignInScreenProps {
    onLogin: (email: string, password?: string) => void;
    onSwitchToSignUp: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRecovery, setShowRecovery] = useState(false);
    const [recoverySent, setRecoverySent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email.trim() || !password) {
            setError("Please provide your credentials.");
            if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
            return;
        }

        setIsLoading(true);
        // Artificial delay for that "secure check" feeling
        setTimeout(() => {
            try {
                onLogin(email, password);
                if ('vibrate' in navigator) navigator.vibrate(10);
            } catch (err: any) {
                setError(err.message || "Credential mismatch. Please try again.");
                setIsLoading(false);
                if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
            }
        }, 1200);
    };

    const handleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        setRecoverySent(true);
        setTimeout(() => {
            setShowRecovery(false);
            setRecoverySent(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] via-[#FCE7F3] to-[#E0D9FE] dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col justify-center items-center p-6 animate-fade-in">
            {/* Password Recovery Modal */}
            {showRecovery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-pop border border-pink-50 dark:border-slate-700">
                        {!recoverySent ? (
                            <form onSubmit={handleRecovery} className="text-center space-y-6">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full inline-block">
                                    <WarningIcon className="w-8 h-8 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Recover Sanctuary</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Enter your email and we'll send recovery instructions.</p>
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="your@email.com"
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all dark:text-slate-100"
                                />
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowRecovery(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-[#E18AAA] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Send Link</button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-4 py-6">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full inline-block">
                                    <CheckIcon className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-600">Soul Link Sent</h3>
                                <p className="text-sm text-gray-500">Check your inbox to reset your password.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full max-w-sm relative">
                <div className="text-center mb-10 relative z-10">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 rounded-[2.5rem] shadow-xl inline-block mb-6 border border-white/50 dark:border-slate-700 animate-float">
                         <AnaraLogo className="h-16 w-16 text-[#F4ABC4]"/>
                    </div>
                    <h1 className="text-4xl font-bold text-[#4B4246] dark:text-slate-100 mb-2 font-serif">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium tracking-wide">Enter your sanctuary to continue blooming.</p>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 border border-white dark:border-slate-700/50 relative z-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-300 rounded-2xl text-[10px] font-bold text-center border border-rose-100 dark:border-rose-800/50 animate-pop flex items-center gap-2">
                                <WarningIcon className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label className="block text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Account Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full p-4 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/20 focus:border-[#F4ABC4] transition-all dark:text-slate-100 outline-none shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Password</label>
                                <button type="button" onClick={() => setShowRecovery(true)} className="text-[9px] font-bold text-[#E18AAA] uppercase tracking-widest hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-4 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/20 focus:border-[#F4ABC4] transition-all dark:text-slate-100 outline-none pr-14 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-[#E18AAA] transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <button 
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#E18AAA] border-[#E18AAA]' : 'bg-transparent border-gray-200 dark:border-slate-600'}`}
                            >
                                {rememberMe && <CheckIcon className="w-3 h-3 text-white" />}
                            </button>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>Remember session</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 disabled:scale-100 active:scale-95 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
                        >
                            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                            {isLoading ? 'Decrypting Soul...' : 'Enter Sanctuary'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-xs mt-10 font-bold uppercase tracking-widest">
                    New Friend?{' '}
                    <button onClick={onSwitchToSignUp} className="text-[#E18AAA] dark:text-pink-400 hover:underline transition-colors">
                        Begin Journey
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

export default SignInScreen;
