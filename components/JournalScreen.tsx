
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
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

const JournalScreen: React.FC<JournalScreenProps> = ({ entries, setEntries, moodHistory = [], user }) => {
    const [activeTab, setActiveTab] = useState<'write' | 'entries'>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [linkedMood, setLinkedMood] = useState<MoodEntry['mood'] | null>(null);
    const [attachments, setAttachments] = useState<{type: 'image'|'video', url: string}[]>([]);
    const [isProcessingMedia, setIsProcessingMedia] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{type: 'image'|'video', url: string} | null>(null);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [naraPrompt, setNaraPrompt] = useState<string | null>(null);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateNaraPrompt = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const recentMoods = moodHistory.slice(0, 3).map(m => m.mood).join(', ');
            const lastEntrySnippet = entries[0]?.content.substring(0, 100) || "No entries yet.";
            
            const prompt = `User: ${user?.name}. Context: Recent Moods: ${recentMoods || 'Neutral'}. Last Journal Context: ${lastEntrySnippet}. Generate ONE deeply personal, unique journaling prompt to help the user process their current emotions. One sentence only. No fluff.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { maxOutputTokens: 100, systemInstruction: "You are Nara, a world-class journaling guide who crafts soulful prompts." }
            });
            if (response.text) setNaraPrompt(response.text.trim());
        } catch { setNaraPrompt("What is your heart telling you today?"); }
        finally { setIsGenerating(false); }
    };

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

    return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto">
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
                <div className="space-y-6 animate-fade-in">
                    {/* Nara Prompt Card */}
                    <div className="bg-gradient-to-br from-[#E0D9FE] to-[#FCE7F3] dark:from-indigo-900/40 dark:to-purple-900/40 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-purple-600" />
                                <h3 className="text-xl font-bold font-serif text-purple-900 dark:text-purple-100">Nara's AI Spark</h3>
                            </div>
                            <button onClick={generateNaraPrompt} disabled={isGenerating} className="text-[10px] font-bold font-sans uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 text-purple-600 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                                {isGenerating ? 'Igniting...' : (naraPrompt ? 'Refresh Spark' : 'Get Spark')}
                            </button>
                        </div>
                        {naraPrompt && (
                            <button onClick={() => { setTitle(naraPrompt); textareaRef.current?.focus(); }} className="text-left w-full p-6 bg-white/40 dark:bg-slate-800/40 rounded-3xl border border-white/50 hover:bg-white/60 dark:hover:bg-slate-800 transition-all">
                                <p className="text-lg font-medium font-serif italic text-purple-900 dark:text-purple-100">"{naraPrompt}"</p>
                            </button>
                        )}
                    </div>

                    {/* Main Editor */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border-t-[6px] border-[#E18AAA] dark:border-pink-900">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="A title for this memory..." className="w-full text-2xl font-bold font-serif p-2 bg-transparent border-b border-gray-100 dark:border-slate-700 outline-none mb-6 dark:text-white placeholder-gray-300" />
                        <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} placeholder="What's blooming in your mind today?" className="w-full h-80 bg-transparent outline-none dark:text-slate-200 text-lg font-sans leading-relaxed resize-none scrollbar-thin" />
                        
                        {/* Media Tray during Edit */}
                        {(attachments.length > 0 || isProcessingMedia) && (
                            <div className="mt-4 flex gap-4 overflow-x-auto pb-6 scrollbar-thin scroll-smooth px-1">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative h-32 w-32 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 group ring-4 ring-transparent hover:ring-pink-100 transition-all">
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
                                        <button onClick={() => removeAttachment(idx)} className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full text-red-500 shadow-md transform scale-0 group-hover:scale-100 transition-transform hover:bg-red-50">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {isProcessingMedia && (
                                    <div className="h-32 w-32 flex-shrink-0 rounded-3xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center animate-pulse border border-dashed border-gray-300">
                                        <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest mb-4">Mood Check-in</p>
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                        {MOODS.map(m => (
                                            <button key={m.name} onClick={() => setLinkedMood(linkedMood === m.name ? null : m.name)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all shrink-0 ${linkedMood === m.name ? 'border-[#E18AAA] bg-pink-50' : 'border-transparent bg-gray-50 dark:bg-slate-900/50'}`}>
                                                <m.Icon className="w-6 h-6" />
                                                <span className="text-[8px] font-bold font-sans uppercase dark:text-slate-400">{m.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-pink-50 dark:bg-slate-700 rounded-2xl text-[#E18AAA] hover:bg-pink-100 transition-all active:scale-95 shadow-sm border border-pink-100 dark:border-slate-600 font-bold text-xs uppercase tracking-widest">
                                        <MediaIcon className="w-5 h-5" />
                                        <span>Add Media</span>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileUpload} />
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSave} disabled={!content.trim()} className="w-full bg-[#E18AAA] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-pink-600 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                <CheckIcon className="w-5 h-5" /> Save Memory
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    {entries.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-700">
                            <JournalIcon className="w-12 h-12 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                            <h4 className="text-xl font-bold font-serif text-gray-400">No memories seeded yet.</h4>
                        </div>
                    ) : (
                        entries.map(entry => (
                            <div key={entry.id} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#E18AAA] opacity-40"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100 group-hover:text-[#E18AAA] transition-colors">{entry.title || 'Untitled Memory'}</h3>
                                        </div>
                                        <p className="text-[10px] font-bold font-sans uppercase tracking-widest text-gray-400 dark:text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                                <p className="text-base font-sans text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-6">{entry.content}</p>
                                
                                {entry.attachments && entry.attachments.length > 0 && (
                                    <div className={`grid gap-3 rounded-[2rem] overflow-hidden ${
                                        entry.attachments.length === 1 ? 'grid-cols-1' : 
                                        entry.attachments.length === 2 ? 'grid-cols-2' : 
                                        'grid-cols-2 sm:grid-cols-3'
                                    }`}>
                                        {entry.attachments.map((file, i) => (
                                            <div 
                                                key={i} 
                                                className="aspect-square relative group/media cursor-pointer overflow-hidden rounded-2xl"
                                                onClick={() => setSelectedMedia(file)}
                                            >
                                                {file.type === 'image' ? (
                                                    <img src={file.url} className="h-full w-full object-cover transition-transform group-hover/media:scale-110" loading="lazy" />
                                                ) : (
                                                    <div className="relative h-full w-full">
                                                        <video src={file.url} className="h-full w-full object-cover transition-transform group-hover/media:scale-110" />
                                                        <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/40 transition-colors flex items-center justify-center">
                                                            <div className="bg-white/30 backdrop-blur-md p-3 rounded-full scale-90 group-hover/media:scale-100 transition-transform">
                                                                <CheckIcon className="w-5 h-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded-md text-[8px] font-bold text-white uppercase tracking-widest">
                                                            Video
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none rounded-2xl" />
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
