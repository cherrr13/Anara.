
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { JournalEntry, MoodEntry, User, Cycle, DayLog } from '../types';
import { 
    DeleteIcon, SparklesIcon, XMarkIcon, AddIcon, CheckIcon, 
    JournalIcon, MoonIcon, StarIcon, GratefulMoodIcon, HappyMoodIcon, 
    CalmMoodIcon, TiredMoodIcon, FrustratedMoodIcon, SadMoodIcon, 
    MediaIcon, TrashIcon, BackIcon 
} from './icons.tsx';

interface JournalScreenProps {
    entries: JournalEntry[];
    setEntries: (entries: JournalEntry[]) => void;
    moodHistory?: MoodEntry[];
    user: User | null;
    cycleData?: { cycles: Cycle[], dayLogs: Record<string, DayLog> };
}

const MOODS = [
    { name: 'Happy', Icon: HappyMoodIcon }, { name: 'Calm', Icon: CalmMoodIcon }, { name: 'Tired', Icon: TiredMoodIcon },
    { name: 'Frustrated', Icon: FrustratedMoodIcon }, { name: 'Sad', Icon: SadMoodIcon }, { name: 'Grateful', Icon: GratefulMoodIcon }
] as const;

const PROMPT_LIBRARY = [
    "What is one thing that made you smile today?",
    "Describe a small victory you achieved this week.",
    "What does your ideal peaceful morning look like?",
    "Who is someone you are grateful for right now, and why?",
    "What is a challenge you’ve overcome recently?",
    "Write about a dream or goal that feels close to your heart.",
    "How does your body feel in this exact moment?",
    "What is a lesson a difficult situation taught you?",
    "List three things you love about your personality.",
    "If you could give your younger self one piece of advice, what would it be?",
    "What is a scent or sound that brings you instant comfort?",
    "What are you looking forward to in the coming month?",
    "How have you shown kindness to yourself today?",
    "Describe a place where you feel completely safe and at home.",
    "What is a habit you want to nurture for your future self?",
    "What is a boundary you are proud of setting?",
    "If you could spend a day anywhere, where would it be?",
    "What part of your day do you wish lasted longer?"
];

// --- MEDIA LIGHTBOX COMPONENT ---
interface MediaLightboxProps {
    media: { type: 'image' | 'video'; url: string };
    onClose: () => void;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({ media, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
            onClick={onClose}
        >
            <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
                {media.type === 'video' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
                        title="Toggle Fullscreen"
                    >
                        <SparklesIcon className="w-6 h-6" />
                    </button>
                )}
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {media.type === 'image' ? (
                    <img 
                        src={media.url} 
                        alt="Journal Detail" 
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-pop"
                    />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center group/video">
                        <video 
                            ref={videoRef}
                            src={media.url} 
                            controls
                            autoPlay
                            className="max-w-full max-h-full rounded-xl shadow-2xl bg-black"
                        />
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] pointer-events-none">
                {media.type === 'video' ? 'Video Playback Active' : 'Image View Active'}
            </div>
        </div>
    );
};

const JournalScreen: React.FC<JournalScreenProps> = ({ entries, setEntries, user }) => {
    const [activeTab, setActiveTab] = useState<'write' | 'entries'>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [linkedMood, setLinkedMood] = useState<MoodEntry['mood'] | null>(null);
    const [attachments, setAttachments] = useState<{type: 'image'|'video', url: string}[]>([]);
    const [isProcessingMedia, setIsProcessingMedia] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{type: 'image'|'video', url: string} | null>(null);
    
    // State for multiple prompts
    const [activePrompts, setActivePrompts] = useState<string[]>([]);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const refreshPrompts = useCallback(() => {
        const shuffled = [...PROMPT_LIBRARY].sort(() => 0.5 - Math.random());
        setActivePrompts(shuffled.slice(0, 3));
        if ('vibrate' in navigator) navigator.vibrate(10);
    }, []);

    useEffect(() => {
        if (activePrompts.length === 0) refreshPrompts();
    }, [activePrompts, refreshPrompts]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        if (files.length === 0) return;
        
        setIsProcessingMedia(true);
        const filePromises = files.map(file => {
            return new Promise<{type: 'image'|'video', url: string}>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const url = event.target?.result as string;
                    const type = file.type.startsWith('video') ? 'video' : 'image';
                    resolve({ type, url });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(newMedia => {
            setAttachments(prev => [...prev, ...newMedia]);
            setIsProcessingMedia(false);
        }).catch(() => setIsProcessingMedia(false));

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!content.trim()) return;
        setEntries([{ 
            id: Date.now().toString(), 
            title: title || 'Journal Entry', 
            content, 
            date: new Date(), 
            linkedMood: linkedMood ?? undefined, 
            attachments
        }, ...entries]);
        setTitle(''); setContent(''); setLinkedMood(null); setAttachments([]); setActiveTab('entries');
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    const usePromptAsTitle = (promptText: string) => {
        setTitle(promptText);
        textareaRef.current?.focus();
        if ('vibrate' in navigator) navigator.vibrate(15);
    };

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            {selectedMedia && (
                <MediaLightbox 
                    media={selectedMedia} 
                    onClose={() => setSelectedMedia(null)} 
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-serif text-[#4B4246] dark:text-slate-100">Journal</h2>
                    <p className="text-base font-sans text-[#8D7F85] dark:text-slate-400 mt-1">A sanctuary for your thoughts and growth.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 w-full sm:w-auto shadow-sm">
                    <button onClick={() => setActiveTab('write')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold font-sans transition-all ${activeTab === 'write' ? 'bg-white dark:bg-slate-700 text-[#E18AAA] shadow-md' : 'text-gray-500'}`}>New Entry</button>
                    <button onClick={() => setActiveTab('entries')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold font-sans transition-all ${activeTab === 'entries' ? 'bg-white dark:bg-slate-700 text-[#E18AAA] shadow-md' : 'text-gray-500'}`}>History</button>
                </div>
            </div>

            {activeTab === 'write' ? (
                <div className="space-y-8 animate-fade-in">
                    {/* Prompt Discovery Card with Multiple Prompts */}
                    <div className="bg-gradient-to-br from-[#E0D9FE] to-[#FCE7F3] dark:from-indigo-900/40 dark:to-purple-900/40 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/40 dark:bg-slate-800/40 rounded-xl">
                                    <SparklesIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-purple-900 dark:text-purple-100">Spark a Memory</h3>
                                    <p className="text-[10px] font-bold font-sans text-purple-400 uppercase tracking-widest">Select a path for your reflection</p>
                                </div>
                            </div>
                            <button onClick={refreshPrompts} className="text-[10px] font-bold font-sans uppercase tracking-widest px-5 py-2.5 bg-white dark:bg-slate-800 text-purple-600 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border border-purple-100 dark:border-slate-700">
                                Refresh All
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                            {activePrompts.map((prompt, index) => (
                                <button 
                                    key={index}
                                    onClick={() => usePromptAsTitle(prompt)}
                                    className="text-left p-6 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/60 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all group/prompt flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md hover:-translate-y-1"
                                >
                                    <p className="text-sm sm:text-base font-medium font-serif italic text-purple-900 dark:text-purple-100 leading-relaxed">
                                        "{prompt}"
                                    </p>
                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-4 flex items-center gap-2 text-[#E18AAA] opacity-0 group-hover/prompt:opacity-100 transition-opacity">
                                        <CheckIcon className="w-3 h-3" /> Tap to Use
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Editor - Horizontal Rectangle Layout */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border-t-[8px] border-[#E18AAA] dark:border-pink-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/20 dark:bg-pink-900/5 -translate-y-32 translate-x-32 rounded-full pointer-events-none"></div>
                        
                        <div className="mb-8">
                            <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-2 block">Entry Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="A title for this memory..." 
                                className="w-full text-2xl sm:text-3xl font-bold font-serif p-0 bg-transparent border-none outline-none dark:text-white placeholder-gray-200" 
                            />
                        </div>
                        
                        <div className="relative mb-8">
                            <label className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-3 block">Reflections</label>
                            {/* Adjusted height to be more of a wide rectangle */}
                            <textarea 
                                ref={textareaRef} 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                placeholder="What's blooming in your mind today?" 
                                className="w-full h-32 sm:h-40 bg-gray-50/50 dark:bg-slate-900/20 p-6 rounded-[2rem] outline-none dark:text-slate-200 text-lg sm:text-xl font-sans leading-relaxed resize-none scrollbar-thin border border-transparent focus:border-pink-100 dark:focus:border-pink-900/30 transition-all shadow-inner" 
                            />
                            <div className="absolute bottom-6 right-6 pointer-events-none opacity-10">
                                <JournalIcon className="w-12 h-12 text-[#E18AAA]" />
                            </div>
                        </div>
                        
                        {/* Media Tray during Edit */}
                        {(attachments.length > 0 || isProcessingMedia) && (
                            <div className="mb-8 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth px-1">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative h-28 w-28 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700 group ring-4 ring-transparent hover:ring-pink-100 transition-all">
                                        {file.type === 'image' ? (
                                            <img src={file.url} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video src={file.url} className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="bg-white/30 backdrop-blur-md p-2 rounded-full">
                                                        <StarIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <button onClick={() => removeAttachment(idx)} className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full text-red-500 shadow-sm transform scale-0 group-hover:scale-100 transition-transform hover:bg-red-50">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {isProcessingMedia && (
                                    <div className="h-28 w-28 flex-shrink-0 rounded-3xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center animate-pulse border-2 border-dashed border-gray-200">
                                        <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-8 border-t border-gray-100 dark:border-slate-700 space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="w-full md:w-auto">
                                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4">Current Vibe</p>
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                        {MOODS.map(m => (
                                            <button key={m.name} onClick={() => setLinkedMood(linkedMood === m.name ? null : m.name)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all shrink-0 ${linkedMood === m.name ? 'border-[#E18AAA] bg-pink-50 dark:bg-pink-900/20' : 'border-transparent bg-gray-50 dark:bg-slate-900/50'}`}>
                                                <m.Icon className="w-6 h-6" />
                                                <span className="text-[8px] font-bold font-sans uppercase tracking-widest dark:text-slate-400">{m.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto self-end">
                                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-pink-50 dark:bg-slate-700 rounded-2xl text-[#E18AAA] hover:bg-pink-100 transition-all active:scale-95 shadow-sm border border-pink-100 dark:border-slate-600 font-bold text-xs uppercase tracking-[0.2em]">
                                        <MediaIcon className="w-5 h-5" />
                                        <span>Add Media</span>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileUpload} />
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSave} disabled={!content.trim()} className="w-full bg-[#E18AAA] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-pink-600 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs">
                                <CheckIcon className="w-6 h-6" /> Commit to Memory
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {entries.length === 0 ? (
                        <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-700">
                            <JournalIcon className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-6" />
                            <h4 className="text-2xl font-bold font-serif text-gray-400">Your story starts here.</h4>
                        </div>
                    ) : (
                        entries.map(entry => (
                            <div key={entry.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#E18AAA] opacity-40"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold font-serif text-gray-800 dark:text-slate-100 group-hover:text-[#E18AAA] transition-colors">{entry.title || 'Untitled Memory'}</h3>
                                            {entry.linkedMood && (
                                                <div className="p-1.5 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                    {React.createElement(MOODS.find(m => m.name === entry.linkedMood)?.Icon || HappyMoodIcon, { className: "w-4 h-4" })}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold font-sans uppercase tracking-widest text-gray-400 dark:text-slate-500">{new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-gray-200 hover:text-red-500 p-3 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"><DeleteIcon className="w-5 h-5" /></button>
                                </div>
                                <p className="text-lg font-sans text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-8">{entry.content}</p>
                                
                                {entry.attachments && entry.attachments.length > 0 && (
                                    <div className={`grid gap-4 rounded-[2.5rem] overflow-hidden ${
                                        entry.attachments.length === 1 ? 'grid-cols-1' : 
                                        entry.attachments.length === 2 ? 'grid-cols-2' : 
                                        'grid-cols-2 sm:grid-cols-3'
                                    }`}>
                                        {entry.attachments.map((file, i) => (
                                            <div 
                                                key={i} 
                                                className="aspect-[4/3] relative group/media cursor-pointer overflow-hidden rounded-3xl"
                                                onClick={() => setSelectedMedia(file)}
                                            >
                                                {file.type === 'image' ? (
                                                    <img src={file.url} className="h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-110" loading="lazy" />
                                                ) : (
                                                    <div className="relative h-full w-full">
                                                        <video src={file.url} className="h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-110" />
                                                        <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/40 transition-colors flex items-center justify-center">
                                                            <div className="bg-white/30 backdrop-blur-md p-4 rounded-full scale-90 group-hover/media:scale-100 transition-transform">
                                                                <CheckIcon className="w-6 h-6 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest backdrop-blur-sm">
                                                            Video
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none rounded-3xl" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default JournalScreen;
