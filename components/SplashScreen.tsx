import React from 'react';
import { AnaraLogo } from './icons';

const SplashScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF9] flex flex-col items-center justify-center animate-fade-in">
            <AnaraLogo className="h-24 w-24 text-[#F4ABC4] mb-4"/>
            <h1 className="text-4xl font-bold text-[#E18AAA]" style={{fontFamily: "'Playfair Display', serif"}}>
                Anara
            </h1>
            <p className="text-[#8D7F85] mt-2">Your wellness companion.</p>
        </div>
    );
};

export default SplashScreen;