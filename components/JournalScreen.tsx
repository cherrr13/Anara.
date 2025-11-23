
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { JournalEntry, MoodEntry } from '../types';
import { DeleteIcon, MediaIcon, EditIcon, SparklesIcon, ShareIcon, XMarkIcon } from './icons';

interface JournalScreenProps {
    entries: JournalEntry[];
    setEntries: (entries: JournalEntry[]) => void;
}

const moods: MoodEntry['mood'][] = ['Happy', 'Calm', 'Tired', 'Frustrated', 'Sad', 'Grateful'];

const allWritingPrompts = [
    'What made you smile today?',
    'What are you grateful for?',
    'What challenged you today?',
    'How did you take care of yourself?',
    'What are you looking forward to?',
    'What did you learn today?',
    'How are you feeling right now?',
    'What would make tomorrow better?',
    'Who made a positive impact on your day?',
    'Describe a moment of peace you had.',
    'What is one goal you are working towards?',
    'Write about a small victory.',
    'What energy do you want to bring into tomorrow?',
    'If you could change one thing about today, what would it be?',
    'What does "wellness" mean to you right now?',
    'Describe your ideal morning routine.',
    'What is a habit you want to build?',
    'Reflect on a recent success.',
    'What brings you comfort when you are stressed?',
    'Write a letter to your future self.',
    'What is something beautiful you saw recently?',
];

const JournalScreen: React.FC<JournalScreenProps> = ({ entries, setEntries }) => {
    const [activeTab, setActiveTab] = useState<'write' | 'entries'>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [linkedMood, setLinkedMood] = useState<MoodEntry['mood'] | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    // New: support multiple attachments
    const [attachments, setAttachments] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
    const [displayedPrompts, setDisplayedPrompts] = useState<string[]>([]);
    const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
    const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initialize AI Client
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

    // Function to get a set of random prompts
    const getRandomPrompts = () => {
        const shuffled = [...allWritingPrompts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    };

    // Initialize prompts on mount
    useEffect(() => {
        setDisplayedPrompts(getRandomPrompts());
    }, []);

    const handleShufflePrompts = () => {
        setDisplayedPrompts(getRandomPrompts());
    };

    const handleGenerateAiPrompts = async () => {
        setIsLoadingPrompts(true);
        try {
            // Context gathering - richer context
            const recentEntries = entries.slice(0, 5).map(e => 
                `[${e.date.toLocaleDateString()}] Mood: ${e.linkedMood || 'None'} - ${e.content.substring(0, 150)}...`
            ).join('\n');
            
            const prompt = `
                You are an empathetic wellness companion. Generate 4 personalized journaling prompts based on the user's current state.

                User Context:
                - Current Selected Mood: ${linkedMood || 'Not specified (Neutral/Unknown)'}
                - Recent Journal Entries (for context on themes, do not repeat these):
                ${recentEntries || 'No recent entries.'}

                Guidelines for Prompts:
                1. **If Mood is Negative (Sad, Tired, Frustrated):** Focus on "Processing" and "Self-Compassion". Prompts should be gentle, validating, and low-pressure. Example themes: identifying triggers, permission to rest, small comforts.
                2. **If Mood is Positive (Happy, Calm, Grateful):** Focus on "Savoring" and "Growth". Prompts should help the user internalize this good feeling or plan for the future.
                3. **If Mood is Unspecified:** Provide a balanced mix including one gratitude prompt, one self-reflection prompt, and one "present moment" check-in.
                4. **Tone:** Always warm, non-judgmental, and supportive.
                
                Format:
                Return purely a JSON array of strings.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });

            if (response.text) {
                const newPrompts = JSON.parse(response.text);
                if (Array.isArray(newPrompts) && newPrompts.length > 0) {
                    setDisplayedPrompts(newPrompts.slice(0, 4));
                }
            }
        } catch (error) {
            console.error("Failed to generate AI prompts", error);
            // Fallback to shuffle if AI fails
            handleShufflePrompts();
        } finally {
            setIsLoadingPrompts(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Append new files to existing attachments
        Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                setAttachments(prev => [...prev, { type, url }]);
            };
            reader.readAsDataURL(file);
        });
        
        // Reset input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadClick = async () => {
         fileInputRef.current?.click();
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    const handleClearForm = () => {
        setTitle('');
        setContent('');
        setLinkedMood(null);
        setTags([]);
        setTagInput('');
        setAttachments([]);
    }

    const handleSaveEntry = () => {
        if (content.trim() === '' && attachments.length === 0) return; // Prevent saving completely empty entries

        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            title: title.trim() ? title.trim() : undefined,
            content: content.trim(),
            date: new Date(),
            linkedMood: linkedMood ?? undefined,
            tags: tags,
            attachments: attachments,
        };

        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }

        setEntries([newEntry, ...entries]);
        handleClearForm();
        setActiveTab('entries');
    };

    const handlePromptClick = (prompt: string) => {
        setTitle(prompt);
        textareaRef.current?.focus();
    };
    
    const handleShare = async (entry: JournalEntry) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: entry.title || 'My Journal Entry',
                    text: `${entry.title ? entry.title + '\n\n' : ''}${entry.content}`,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            alert("Sharing is not supported on this device/browser.");
        }
    };
    
    const moodColors: Record<MoodEntry['mood'], string> = { Happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', Calm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300', Sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', Tired: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300', Frustrated: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', Grateful: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' };

    return (
        <div>
            {/* Fullscreen Media Modal */}
            {fullscreenMedia && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullscreenMedia(null)}>
                    <button onClick={() => setFullscreenMedia(null)} className="absolute top-4 right-4 text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 transition">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                    <div className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                        {fullscreenMedia.type === 'image' ? (
                            <img src={fullscreenMedia.url} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                        ) : (
                            <video src={fullscreenMedia.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg shadow-2xl bg-black" />
                        )}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-[#4B4246] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>Your Journal</h2>
                <p className="text-[#8D7F85] dark:text-slate-400">Express yourself and reflect on your day</p>
            </div>

            <div className="flex border-b border-pink-100 dark:border-slate-700 mt-4 mb-6">
                <button onClick={() => setActiveTab('write')} className={`py-2 px-4 text-sm font-semibold relative ${activeTab === 'write' ? 'text-[#E18AAA] dark:text-pink-400' : 'text-gray-500 dark:text-slate-400'}`}>
                    Write
                    {activeTab === 'write' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E18AAA] dark:bg-pink-400 rounded-full"></div>}
                </button>
                <button onClick={() => setActiveTab('entries')} className={`py-2 px-4 text-sm font-semibold relative ${activeTab === 'entries' ? 'text-[#E18AAA] dark:text-pink-400' : 'text-gray-500 dark:text-slate-400'}`}>
                    Entries ({entries.length})
                    {activeTab === 'entries' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E18AAA] dark:bg-pink-400 rounded-full"></div>}
                </button>
            </div>

            {activeTab === 'write' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6 animate-fade-in">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                             <h3 className="font-bold text-gray-700 dark:text-slate-200">Daily Prompts</h3>
                             <div className="flex gap-2">
                                <button 
                                    onClick={handleGenerateAiPrompts} 
                                    disabled={isLoadingPrompts}
                                    className="text-xs flex items-center gap-1 text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 px-3 py-1.5 rounded-full transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoadingPrompts ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-3 h-3"/> AI Inspire
                                        </>
                                    )}
                                </button>
                                <button 
                                    onClick={handleShufflePrompts} 
                                    disabled={isLoadingPrompts}
                                    className="text-xs flex items-center gap-1 text-gray-600 dark:text-slate-300 font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Shuffle
                                </button>
                             </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Need inspiration? Select a mood below for personalized ideas, or tap a question.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {displayedPrompts.map((prompt, index) => (
                                <button key={index} onClick={() => handlePromptClick(prompt)} className="text-left text-sm text-gray-600 dark:text-slate-300 bg-rose-50 dark:bg-slate-700 p-3 rounded-lg hover:bg-rose-100 dark:hover:bg-slate-600 transition border border-transparent hover:border-rose-200 dark:hover:border-slate-500">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative pt-2">
                         <div className="flex items-center justify-between mb-2">
                             <label className="font-bold text-gray-700 dark:text-slate-200 text-lg">Title</label>
                             <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">Custom or from prompt</span>
                         </div>
                        <div className="relative">
                             <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g., My Morning Routine"
                                className="w-full p-4 pl-10 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-[#F4ABC4]/20 focus:border-[#F4ABC4] transition bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 dark:border-slate-600 dark:placeholder-slate-400 font-semibold"
                            />
                            <EditIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="font-bold text-gray-700 dark:text-slate-200 mb-2 block">Your thoughts</label>
                        <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} placeholder="Start writing..." rows={6} className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200 dark:border-slate-600 dark:placeholder-slate-400"></textarea>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-slate-200 mb-3">Link to mood <span className="font-normal text-gray-500 dark:text-slate-400">(select to personalize AI prompts)</span></h3>
                        <div className="flex flex-wrap gap-2">
                            {moods.map(mood => (
                                <button key={mood} onClick={() => setLinkedMood(mood)} className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${linkedMood === mood ? 'bg-[#E0D9FE] border-[#C4B5FD] text-indigo-800 dark:bg-indigo-900/50 dark:border-indigo-700 dark:text-indigo-300' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600'}`}>
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-slate-200 mb-3">Attachments <span className="font-normal text-gray-500 dark:text-slate-400">(photos & videos)</span></h3>
                        
                        {/* Attachment Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                            {attachments.map((att, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-700">
                                    {att.type === 'image' ? (
                                        <img src={att.url} alt={`Attachment ${index}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={att.url} className="w-full h-full object-cover bg-black" />
                                    )}
                                    <button
                                        onClick={() => handleRemoveAttachment(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                        aria-label="Remove attachment"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add Button */}
                            <button
                                onClick={handleUploadClick}
                                className="aspect-square flex flex-col items-center justify-center p-2 border-2 border-dashed border-pink-300 dark:border-slate-600 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-700/50 transition-colors group"
                            >
                                <div className="bg-pink-100 dark:bg-slate-700 rounded-full p-2 mb-1 group-hover:scale-110 transition-transform">
                                     <MediaIcon className="w-6 h-6 text-pink-500 dark:text-slate-400" />
                                </div>
                                <span className="text-xs font-semibold text-pink-500 dark:text-slate-400">Add</span>
                            </button>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 dark:text-slate-200 mb-2">Add tags</h3>
                         <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                                <div key={tag} className="flex items-center bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-medium px-2 py-1 rounded-full">
                                    <span>{tag}</span>
                                    <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"><DeleteIcon className="w-3 h-3"/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => {if(e.key === 'Enter') { e.preventDefault(); handleAddTag();}}} placeholder="Type tag and press Enter..." className="flex-grow p-2 border border-pink-100 rounded-lg focus:ring-2 focus:ring-[#F4ABC4] transition text-sm bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"/>
                            <button onClick={handleAddTag} className="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 font-semibold px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 text-sm">Add</button>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={handleClearForm} className="font-bold py-2 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-600 dark:text-slate-300">Clear</button>
                        <button onClick={handleSaveEntry} disabled={!content.trim() && attachments.length === 0} className="bg-[#E18AAA] text-white font-bold py-2 px-8 rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400 disabled:dark:bg-slate-600 transform hover:scale-105">Save Entry</button>
                    </div>
                </div>
            )}

            {activeTab === 'entries' && (
                <div className="space-y-6">
                    {entries.length > 0 ? entries.map((entry, index) => (
                        <div 
                            key={entry.id} 
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-5 animate-list-item relative"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                             {/* Share Button - Absolute positioned */}
                             <button 
                                onClick={() => handleShare(entry)}
                                className="absolute top-5 right-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full text-gray-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-600 hover:text-pink-500 dark:hover:text-pink-400 transition-colors shadow-sm"
                                aria-label="Share Entry"
                            >
                                <ShareIcon className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">{entry.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            
                            {entry.title && (
                                <h3 className="text-xl font-bold text-[#4B4246] dark:text-slate-100 mb-2 pr-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {entry.title}
                                </h3>
                            )}

                            {entry.linkedMood && (
                                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${moodColors[entry.linkedMood]} mb-3`}>
                                    {entry.linkedMood}
                                </span>
                            )}
                            
                            <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap mb-4">{entry.content}</p>

                            {/* Attachments Gallery/Carousel */}
                            {entry.attachments && entry.attachments.length > 0 && (
                                <div className="mb-4">
                                    {entry.attachments.length === 1 ? (
                                        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer" onClick={() => setFullscreenMedia(entry.attachments![0])}>
                                             {entry.attachments[0].type === 'image' ? (
                                                <img src={entry.attachments[0].url} alt="Attachment" className="w-full max-h-80 object-cover hover:opacity-95 transition-opacity" />
                                            ) : (
                                                <video src={entry.attachments[0].url} controls className="w-full max-h-80 bg-black" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
                                            {entry.attachments.map((att, i) => (
                                                <div 
                                                    key={i} 
                                                    className="flex-shrink-0 w-64 h-48 relative snap-center rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer group"
                                                    onClick={() => setFullscreenMedia(att)}
                                                >
                                                    {att.type === 'image' ? (
                                                        <img src={att.url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full bg-black flex items-center justify-center relative">
                                                            <video src={att.url} className="w-full h-full object-cover opacity-80" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="bg-white/30 backdrop-blur-md rounded-full p-2">
                                                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-pink-50 dark:border-slate-700/50">
                                    {entry.tags.map(tag => <span key={tag} className="bg-rose-50 text-rose-600 text-xs font-medium px-2 py-1 rounded-full dark:bg-rose-900/30 dark:text-rose-300">#{tag}</span>)}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
                            <p className="text-gray-500 dark:text-slate-400">Your journal is empty.</p>
                            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Write a new entry to see it here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JournalScreen;