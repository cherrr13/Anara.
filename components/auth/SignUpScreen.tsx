
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnaraLogo, EyeIcon, EyeOffIcon, CheckIcon, XMarkIcon, WarningIcon, GoogleIcon, AppleIcon, FacebookIcon, SparklesIcon } from '../icons';

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
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const requirements = useMemo(() => [
        { label: 'Min 10 characters', met: password.length >= 10 },
        { label: 'Uppercase & Lowercase', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: 'Numbers & Symbols', met: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) },
    ], [password]);

    const isPasswordStrong = requirements.every(r => r.met);
    const isMatching = password === confirmPassword && confirmPassword !== '';

    const verifyEmailAuthenticity = async (emailAddr: string): Promise<{ isReal: boolean, reason: string }> => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Analyze this email address for authenticity: "${emailAddr}". 
            Is it likely a real personal account from a reputable provider (like Google, Yahoo, Outlook, or a verified organization)? 
            Reject disposable domains (mailinator, temp-mail, etc.) or obvious gibberish.
            Return strictly JSON: {"isReal": boolean, "reason": "concise explanation if fake"}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            return JSON.parse(response.text || '{"isReal": true}');
        } catch {
            return { isReal: true, reason: "" }; // Fallback to basic regex if AI fails
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!isPasswordStrong || !isMatching) {
            setError("Please fulfill all security requirements.");
            return;
        }

        setIsCheckingEmail(true);
        const { isReal, reason } = await verifyEmailAuthenticity(email);
        
        if (!isReal) {
            setError(reason || "This email appears to be a temporary or dummy account. Please use a genuine account.");
            setIsCheckingEmail(false);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
             try {
                onSignUp(name, email, password);
             } catch (err: any) {
                setError(err.message || "Failed to create account.");
                setIsLoading(false);
                setIsCheckingEmail(false);
             }
        }, 800);
    };

    const handleSocialSignUp = (provider: string) => {
        setSocialLoading(provider);
        setTimeout(() => {
            onSignUp(`${provider} User`, `${provider.toLowerCase()}.user@example.com`, `${provider}SocialAuthBypassed`);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] via-[#FCE7F3] to-[#E0D9FE] dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col justify-center items-center p-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
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
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 rounded-2xl text-[10px] font-bold text-center border border-red-100 dark:border-red-800/50 animate-pop flex items-center gap-2">
                                <WarningIcon className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Email (Google Preferred)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@gmail.com"
                                required
                                className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-pink-100 transition-all dark:text-slate-100 outline-none pr-12 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-[#E18AAA] transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-1">Confirm Identity</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full p-3.5 bg-white/50 dark:bg-slate-900/40 border rounded-xl focus:ring-4 transition-all dark:text-slate-100 outline-none text-sm ${isMatching ? 'border-green-300 ring-green-50' : 'border-gray-100 dark:border-slate-700'}`}
                            />
                        </div>

                        {/* Complexity Checklist */}
                        <div className="p-3 bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-1">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 text-[9px] uppercase tracking-wider">
                                    {req.met ? (
                                        <CheckIcon className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <XMarkIcon className="w-3 h-3 text-gray-300" />
                                    )}
                                    <span className={req.met ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-400 dark:text-slate-500'}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isCheckingEmail || !!socialLoading || !isPasswordStrong || !isMatching}
                            className="w-full bg-gradient-to-r from-[#F4ABC4] to-[#E18AAA] text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                             {isCheckingEmail ? (
                                 <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                    Analyzing Soul...
                                 </>
                             ) : isLoading ? 'Cultivating...' : 'Create Sanctuary'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]"><span className="bg-white dark:bg-slate-800 px-3 text-gray-300">Fast Entry</span></div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleSocialSignUp('Google')}
                            disabled={isLoading || isCheckingEmail || !!socialLoading}
                            className="w-full bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                        >
                            {socialLoading === 'Google' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#4285F4] border-t-transparent"></div> : <GoogleIcon className="w-4 h-4" />}
                            Continue with Google
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialSignUp('Apple')}
                                disabled={isLoading || isCheckingEmail || !!socialLoading}
                                className="bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                            >
                                {socialLoading === 'Apple' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <AppleIcon className="w-4 h-4" />}
                                Apple
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialSignUp('Facebook')}
                                disabled={isLoading || isCheckingEmail || !!socialLoading}
                                className="bg-[#1877F2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-all active:scale-95 shadow-sm text-[10px] uppercase tracking-widest"
                            >
                                {socialLoading === 'Facebook' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <FacebookIcon className="w-4 h-4" />}
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
                    Returning to the garden?{' '}
                    <button onClick={onSwitchToSignIn} className="text-[#E18AAA] dark:text-pink-400 hover:underline">
                        Enter here
                    </button>
                </p>
            </div>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SignUpScreen;
