
import React, { useState } from 'react';
import { AnaraLogo, EyeIcon, EyeOffIcon } from '../icons';

interface SignInScreenProps {
    onLogin: (email: string, password?: string) => void;
    onSwitchToSignUp: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        
        // Small delay to simulate network request and show loading state
        setTimeout(() => {
            try {
                onLogin(email, password);
            } catch (err: any) {
                setError(err.message || "Failed to sign in. Please try again.");
                setIsLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] to-[#FCE7F3] dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center items-center p-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="w-full max-w-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-24 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"></div>
                
                <div className="text-center mb-10 relative z-10">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm inline-block mb-4">
                         <AnaraLogo className="h-16 w-16 text-[#F4ABC4]"/>
                    </div>
                    <h1 className="text-4xl font-bold text-[#E18AAA] dark:text-pink-400 mb-2" style={{fontFamily: "'Playfair Display', serif"}}>Welcome Back</h1>
                    <p className="text-gray-500 dark:text-slate-400">Sign in to continue your journey.</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 dark:border-slate-700 relative z-10">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm text-center border border-red-200 dark:border-red-800 animate-pulse">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] focus:border-transparent transition dark:text-slate-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] focus:border-transparent transition dark:text-slate-200 outline-none pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E18AAA] text-white font-bold py-4 px-4 rounded-xl hover:bg-pink-600 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-8">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignUp} className="font-bold text-[#E18AAA] dark:text-pink-400 hover:underline">
                        Create Account
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignInScreen;
