
import React, { useState, useEffect, useMemo } from 'react';
import { AnaraLogo, CheckIcon, SparklesIcon, BackIcon, StarIcon } from '../icons';

interface VerificationScreenProps {
    email: string;
    onVerified: (token?: string) => void;
    onBackToSignIn: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ email, onVerified, onBackToSignIn }) => {
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStep, setVerificationStep] = useState<'pending' | 'success'>('pending');

    // Simulate a unique token based on email
    const uniqueToken = useMemo(() => {
        return btoa(email + Date.now()).substring(0, 16);
    }, [email]);

    const handleResend = () => {
        setIsResending(true);
        // Simulate network delay
        setTimeout(() => {
            setIsResending(false);
            setResendStatus('sent');
            setTimeout(() => setResendStatus('idle'), 4000);
        }, 1500);
    };

    const simulateMagicLinkClick = () => {
        setIsVerifying(true);
        // Simulate verification processing
        setTimeout(() => {
            setVerificationStep('success');
            // Brief pause to show success animation before parent transition
            setTimeout(() => {
                onVerified(uniqueToken);
            }, 1800);
        }, 2200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF9] to-[#FCE7F3] dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center items-center p-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="w-full max-w-md relative text-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700 animate-fade-in relative z-10 overflow-hidden">
                    
                    {verificationStep === 'pending' ? (
                        <div className="animate-fade-in">
                            <div className="bg-pink-100 dark:bg-pink-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative group">
                                <SparklesIcon className="w-10 h-10 text-[#E18AAA] group-hover:scale-110 transition-transform" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold text-[#E18AAA]">1</span>
                                </div>
                            </div>
                            
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Almost Ready!
                            </h1>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
                                We've sent a unique activation link to:
                                <br />
                                <span className="font-bold text-[#E18AAA] dark:text-pink-400 block mt-1 text-base">{email}</span>
                            </p>

                            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 mb-8 text-left relative group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Incoming Message</p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-slate-300 font-medium mb-4">
                                    Subject: Activate your Anara account
                                </p>
                                
                                <button
                                    onClick={simulateMagicLinkClick}
                                    disabled={isVerifying}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-3 ${
                                        isVerifying 
                                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white dark:bg-slate-800 text-[#E18AAA] border-2 border-[#E18AAA] hover:bg-[#E18AAA] hover:text-white transform hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E18AAA] border-t-transparent"></div>
                                            Validating Security Token...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="w-4 h-4" />
                                            Simulate Magic Link Click
                                        </>
                                    )}
                                </button>
                                
                                <p className="text-[9px] text-gray-400 mt-4 text-center italic">
                                    Link ID: {uniqueToken}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleResend}
                                    disabled={isResending || resendStatus === 'sent' || isVerifying}
                                    className="text-xs font-bold text-gray-400 hover:text-[#E18AAA] transition-colors disabled:opacity-50"
                                >
                                    {resendStatus === 'sent' ? '✓ Verification link resent!' : isResending ? 'Sending...' : "Didn't receive it? Resend Email"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pop py-10">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <CheckIcon className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Verified!</h2>
                            <p className="text-gray-500 dark:text-slate-400 font-medium">Your blooming journey begins now...</p>
                            
                            {/* Decorative particles */}
                            <div className="absolute inset-0 pointer-events-none">
                                <StarIcon className="absolute top-1/4 left-1/4 w-4 h-4 text-yellow-400 animate-sparkle" style={{animationDelay: '0s'}} />
                                <StarIcon className="absolute top-1/3 right-1/4 w-3 h-3 text-pink-400 animate-sparkle" style={{animationDelay: '0.5s'}} />
                                <StarIcon className="absolute bottom-1/4 left-1/3 w-5 h-5 text-indigo-400 animate-sparkle" style={{animationDelay: '1s'}} />
                            </div>
                        </div>
                    )}
                </div>

                {verificationStep === 'pending' && (
                    <button 
                        onClick={onBackToSignIn}
                        disabled={isVerifying}
                        className="mt-8 text-gray-400 dark:text-slate-500 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:text-[#E18AAA] dark:hover:text-pink-400 transition-colors disabled:opacity-0"
                    >
                        <BackIcon className="w-4 h-4" /> Cancel & Back to Sign In
                    </button>
                )}
            </div>
            
            <style>{`
                @keyframes sparkle {
                    0% { transform: scale(0) rotate(0deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }
                .animate-sparkle {
                    animation: sparkle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default VerificationScreen;
