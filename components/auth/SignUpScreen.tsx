
import React, { useState, useMemo } from 'react';
import { AnaraLogo, EyeIcon, EyeOffIcon, CheckIcon, XMarkIcon, WarningIcon } from '../icons';

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

    const requirements = useMemo(() => [
        { label: 'At least 10 characters', met: password.length >= 10 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One number', met: /[0-9]/.test(password) },
        { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
    ], [password]);

    const isPasswordStrong = requirements.every(r => r.met);
    const isMatching = password === confirmPassword && confirmPassword !== '';

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!isPasswordStrong) {
            setError("Please fulfill all password requirements.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
             try {
                onSignUp(name, email, password);
             } catch (err: any) {
                setError(err.message || "Failed to create account.");
                setIsLoading(false);
             }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] to-[#FCE7F3] dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center items-center p-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="w-full max-w-sm relative">
                <div className="text-center mb-8 relative z-10">
                    <AnaraLogo className="h-14 w-14 text-[#F4ABC4] mx-auto mb-3"/>
                    <h1 className="text-3xl font-bold text-[#E18AAA] dark:text-pink-400" style={{fontFamily: "'Playfair Display', serif"}}>Create Account</h1>
                    <p className="text-gray-500 dark:text-slate-400">Join the Anara community securely.</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 dark:border-slate-700 relative z-10">
                    <form onSubmit={handleSignUp} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm text-center border border-red-200 dark:border-red-800 animate-pulse flex items-center gap-2">
                                <WarningIcon className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] transition dark:text-slate-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] transition dark:text-slate-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F4ABC4] transition dark:text-slate-200 outline-none pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Complexity Checklist */}
                            <div className="mt-4 p-3 bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-700 space-y-1.5">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Security Requirements</p>
                                {requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs transition-all">
                                        {req.met ? (
                                            <CheckIcon className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <XMarkIcon className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                                        )}
                                        <span className={req.met ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-slate-400'}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full p-4 bg-gray-50 dark:bg-slate-900/50 border rounded-xl focus:ring-2 focus:ring-[#F4ABC4] transition dark:text-slate-200 outline-none pr-12 ${isMatching ? 'border-green-500' : 'border-gray-200 dark:border-slate-600'}`}
                                />
                                {isMatching && <CheckIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordStrong || !isMatching}
                            className="w-full bg-[#E18AAA] text-white font-bold py-4 px-4 rounded-xl hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-2"
                        >
                             {isLoading ? 'Creating Secure Account...' : 'Create Secure Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-8">
                    Already have an account?{' '}
                    <button onClick={onSwitchToSignIn} className="font-bold text-[#E18AAA] dark:text-pink-400 hover:underline">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpScreen;
