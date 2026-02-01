
import React, { useState, useEffect, useMemo } from 'react';
import { AnaraLogo, CheckIcon, SparklesIcon, BackIcon, StarIcon, WarningIcon } from '../icons';

interface VerificationScreenProps {
    email: string;
    onVerified: (token?: string) => void;
    onBackToSignIn: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ email, onVerified, onBackToSignIn }) => {
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [manualCode, setManualCode] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStep, setVerificationStep] = useState<'pending' | 'success'>('pending');
    const [error, setError] = useState('');

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleResend = () => {
        setIsResending(true);
        setTimeout(() => {
            setIsResending(false);
            setResendTimer(60);
            if ('vibrate' in navigator) navigator.vibrate(10);
        }, 1500);
    };

    const handleCodeChange = (val: string, index: number) => {
        if (!/^[0-9]?$/.test(val)) return;
        const newCode = [...manualCode];
        newCode[index] = val;
        setManualCode(newCode);
        
        // Auto-focus next input
        if (val && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleManualVerify = () => {
        const code = manualCode.join('');
        if (code.length < 4) {
            setError('Please enter the 4-digit seed.');
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setVerificationStep('success');
            setTimeout(() => onVerified(code), 1500);
        }, 1200);
    };

    const autoFillCode = () => {
        setManualCode(['1', '1', '1', '1']);
        setError('');
        if ('vibrate' in navigator) navigator.vibrate([10, 50]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] to-[#FCE7F3] dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center items-center p-6 animate-fade-in">
            <div className="w-full max-w-md relative text-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700 animate-fade-in relative z-10 overflow-hidden">
                    
                    {verificationStep === 'pending' ? (
                        <div className="animate-fade-in space-y-8">
                            <div className="bg-pink-100 dark:bg-pink-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner relative group">
                                <SparklesIcon className="w-10 h-10 text-[#E18AAA] group-hover:scale-110 transition-transform" />
                            </div>
                            
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 font-serif">Awaiting Verification</h1>
                                <p className="text-gray-500 dark:text-slate-400 text-sm mt-3 leading-relaxed max-w-[280px] mx-auto">
                                    A spiritual seed is ready for:
                                    <span className="font-bold text-[#E18AAA] block mt-1">{email}</span>
                                </p>
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
                                    <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest leading-relaxed">
                                        Note: For this preview, you can enter any 4 digits to sprout your account.
                                    </p>
                                </div>
                            </div>

                            {/* Manual Code Input Fallback */}
                            <div className="space-y-6">
                                <div className="flex justify-center gap-3">
                                    {manualCode.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`code-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e.target.value, i)}
                                            className="w-14 h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-center text-2xl font-bold text-[#E18AAA] focus:border-[#E18AAA] focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/20 transition-all outline-none"
                                        />
                                    ))}
                                </div>
                                
                                {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}

                                <div className="space-y-3">
                                    <button
                                        onClick={handleManualVerify}
                                        disabled={isVerifying}
                                        className="w-full bg-[#E18AAA] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.25em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <CheckIcon className="w-5 h-5" />}
                                        {isVerifying ? 'Rooting...' : 'Verify Identity'}
                                    </button>
                                    
                                    <button
                                        onClick={autoFillCode}
                                        className="w-full bg-pink-50 dark:bg-slate-700 text-[#E18AAA] dark:text-pink-300 py-3 rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] border border-pink-100 dark:border-slate-600 active:scale-95 transition-all"
                                    >
                                        Auto-Fill Preview Code (1111)
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t dark:border-slate-700">
                                <button
                                    onClick={handleResend}
                                    disabled={isResending || resendTimer > 0}
                                    className="text-[10px] font-bold text-gray-400 hover:text-[#E18AAA] transition-colors uppercase tracking-[0.2em] disabled:opacity-50"
                                >
                                    {resendTimer > 0 ? `Retry in ${resendTimer}s` : isResending ? 'Summoning...' : "Didn't receive? Simulate Resend"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pop py-10">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <CheckIcon className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Soul Verified</h2>
                            <p className="text-gray-500 dark:text-slate-400 font-medium">Redirecting you to the sanctuary...</p>
                        </div>
                    )}
                </div>

                {verificationStep === 'pending' && (
                    <button 
                        onClick={onBackToSignIn}
                        className="mt-8 text-gray-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-[#E18AAA] transition-colors"
                    >
                        <BackIcon className="w-4 h-4" /> Back to Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerificationScreen;
