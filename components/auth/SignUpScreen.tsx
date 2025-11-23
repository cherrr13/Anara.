import React, { useState } from 'react';
import { AnaraLogo } from '../icons';

interface SignUpScreenProps {
    onSignUp: (name: string, email: string) => void;
    onSwitchToSignIn: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToSignIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
             setError("Password must be at least 6 characters.");
             return;
        }

        onSignUp(name, email);
    };

    return (
        <div className="min-h-screen bg-[#FFFBF9] dark:bg-slate-900 flex flex-col justify-center items-center p-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="w-full max-w-sm">
                 <div className="text-center mb-8">
                    <AnaraLogo className="h-16 w-16 text-[#F4ABC4] mx-auto mb-2"/>
                    <h1 className="text-3xl font-bold text-[#E18AAA] dark:text-pink-400" style={{fontFamily: "'Playfair Display', serif"}}>Create Account</h1>
                    <p className="text-gray-500 dark:text-slate-400">Start your wellness journey with Anara.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSignUp}>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="w-full p-3 bg-gray-50 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:dark:ring-pink-500 focus:dark:border-pink-500"
                            />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full p-3 bg-gray-50 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:dark:ring-pink-500 focus:dark:border-pink-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full p-3 bg-gray-50 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:dark:ring-pink-500 focus:dark:border-pink-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full p-3 bg-gray-50 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:dark:ring-pink-500 focus:dark:border-pink-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#E18AAA] text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-300 disabled:dark:bg-slate-600"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-slate-400 text-sm mt-6">
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