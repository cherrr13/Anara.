
import React, { useState } from 'react';
import { AnaraLogo, EyeIcon, EyeOffIcon, GoogleIcon, AppleIcon, FacebookIcon } from '../icons';

interface SignInScreenProps {
    onLogin: (email: string, password?: string) => void;
    onSwitchToSignUp: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email.trim() || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            try {
                onLogin(email, password);
            } catch (err: any) {
                setError(err.message || "Invalid credentials. Please try again.");
                setIsLoading(false);
            }
        }, 800);
    };

    const handleSocialSignIn = (provider: string) => {
        setSocialLoading(provider);
        // Simulate OAuth flow
        setTimeout(() => {
            onLogin(`${provider.toLowerCase()}.user@example.com`, `${provider}VerifiedSession`);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] via-[#FCE7F3] to-[#E0D9FE] dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col justify-center items-center p-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="w-full max-w-sm relative">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-400/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-400/10 rounded-full blur-[100px] animate-pulse"></div>
                
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
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 rounded-2xl text-xs font-bold text-center border border-red-100 dark:border-red-800/50 animate-pop">
                                {error}
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
                            <label className="block text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Password</label>
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

                        <button
                            type="submit"
                            disabled={isLoading || !!socialLoading}
                            className="w-full bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 disabled:scale-100 active:scale-95 uppercase tracking-[0.2em] text-xs"
                        >
                            {isLoading ? 'Verifying...' : 'Enter Sanctuary'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white dark:bg-slate-800 px-4 text-gray-300">Or connect with</span></div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleSocialSignIn('Google')}
                            disabled={isLoading || !!socialLoading}
                            className="w-full bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                        >
                            {socialLoading === 'Google' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#4285F4] border-t-transparent"></div> : <GoogleIcon className="w-4 h-4" />}
                            Google
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialSignIn('Apple')}
                                disabled={isLoading || !!socialLoading}
                                className="bg-black text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                            >
                                {socialLoading === 'Apple' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <AppleIcon className="w-4 h-4" />}
                                Apple
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialSignIn('Facebook')}
                                disabled={isLoading || !!socialLoading}
                                className="bg-[#1877F2] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                            >
                                {socialLoading === 'Facebook' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <FacebookIcon className="w-4 h-4" />}
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-10">
                    New to the garden?{' '}
                    <button onClick={onSwitchToSignUp} className="font-bold text-[#E18AAA] dark:text-pink-400 hover:underline hover:text-pink-600 transition-colors">
                        Create your space
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
