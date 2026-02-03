
import React, { useState, useEffect } from 'react';
import { AnaraLogo, CheckIcon, SparklesIcon, BackIcon, WarningIcon } from '../icons';

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
        
        if (val && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleManualVerify = () => {
        const code = manualCode.join('');
        if (code.length < 4) {
            setError('Please enter the 4-digit verification code.');
            return;
        }
        setIsVerifying(true);
        // Simulate real validation
        setTimeout(() => {
            setVerificationStep('success');
            setTimeout(() => onVerified(code), 1500);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] to-[#FCE7F3] dark:from-slate-900 dark:to-slate-950 flex flex-col justify-center items-center p-6 animate-fade-in">
            <div className="w-full max-w-md relative text-center">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-white dark:border-slate-700 relative z-10 overflow-hidden">
                    
                    {verificationStep === 'pending' ? (
                        <div className="animate-fade-in space-y-8">
                            <div className="bg-pink-100 dark:bg-pink-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner relative group">
                                <SparklesIcon className="w-12 h-12 text-[#E18AAA] group-hover:scale-110 transition-transform" />
                            </div>
                            
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 font-serif">Confirm Your Spirit</h1>
                                <p className="text-gray-500 dark:text-slate-400 text-sm mt-3 leading-relaxed max-w-[300px] mx-auto">
                                    A 4-digit code has been dispatched to:
                                    <span className="font-bold text-[#E18AAA] block mt-1">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-center gap-4">
                                    {manualCode.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`code-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e.target.value, i)}
                                            className="w-16 h-20 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-center text-3xl font-bold text-[#E18AAA] focus:border-[#E18AAA] focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/20 transition-all outline-none shadow-inner"
                                        />
                                    ))}
                                </div>
                                
                                {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pop">{error}</p>}

                                <button
                                    onClick={handleManualVerify}
                                    disabled={isVerifying}
                                    className="w-full bg-[#E18AAA] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isVerifying ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <CheckIcon className="w-5 h-5" />}
                                    {isVerifying ? 'Authenticating...' : 'Verify Soul'}
                                </button>
                            </div>

                            <div className="pt-6 border-t dark:border-slate-700">
                                <button
                                    onClick={handleResend}
                                    disabled={isResending || resendTimer > 0}
                                    className="text-[10px] font-bold text-gray-400 hover:text-[#E18AAA] transition-colors uppercase tracking-[0.2em] disabled:opacity-50"
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : isResending ? 'Dispatching...' : "Didn't receive code? Resend"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pop py-10">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <CheckIcon className="w-14 h-14 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Soul Verified</h2>
                            <p className="text-gray-500 dark:text-slate-400 font-medium">Your sanctuary is manifesting...</p>
                        </div>
                    )}
                </div>

                {verificationStep === 'pending' && (
                    <button 
                        onClick={onBackToSignIn}
                        className="mt-10 text-gray-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-[#E18AAA] transition-colors"
                    >
                        <BackIcon className="w-4 h-4" /> Return to Entry
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerificationScreen;
