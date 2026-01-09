
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateLeftIcon, WandIcon, SaveIcon, XMarkIcon } from './icons';

interface ImageEditorProps {
    imageUrl: string;
    onSave: (newUrl: string) => void;
    onCancel: () => void;
}

interface Rect {
    x: number;
    y: number;
    size: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [filter, setFilter] = useState<'none' | 'grayscale' | 'sepia' | 'contrast'>('none');
    const [rotation, setRotation] = useState(0);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    // Cropping State
    const [crop, setCrop] = useState<Rect>({ x: 50, y: 50, size: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialCrop, setInitialCrop] = useState<Rect | null>(null);

    // Initial Image Load
    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            setImage(img);
            // Initialize crop box to 80% of the smallest dimension
            const initialSize = Math.min(img.width, img.height) * 0.8;
            setCrop({
                x: (img.width - initialSize) / 2,
                y: (img.height - initialSize) / 2,
                size: initialSize
            });
        };
    }, [imageUrl]);

    const drawDisplay = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Visual size for the UI - we fit the image into the preview area
        const maxWidth = containerRef.current?.clientWidth || 500;
        const maxHeight = 400;
        
        let displayWidth = image.width;
        let displayHeight = image.height;
        
        const ratio = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
        displayWidth *= ratio;
        displayHeight *= ratio;

        canvas.width = displayWidth;
        canvas.height = displayHeight;

        // Apply visual filters to preview
        let filterString = 'none';
        if (filter === 'grayscale') filterString = 'grayscale(100%)';
        if (filter === 'sepia') filterString = 'sepia(100%)';
        if (filter === 'contrast') filterString = 'contrast(150%)';
        ctx.filter = filterString;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, displayWidth, displayHeight);
    }, [image, filter, rotation]);

    useEffect(() => {
        drawDisplay();
    }, [drawDisplay]);

    // Conversion helpers between image pixels and display pixels
    const toImageCoords = (val: number) => {
        if (!canvasRef.current || !image) return val;
        return val * (image.width / canvasRef.current.width);
    };
    
    const toDisplayCoords = (val: number) => {
        if (!canvasRef.current || !image) return val;
        return val * (canvasRef.current.width / image.width);
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, mode: 'drag' | 'resize') => {
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        setDragStart({ x: clientX, y: clientY });
        setInitialCrop({ ...crop });
        if (mode === 'drag') setIsDragging(true);
        else setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if ((!isDragging && !isResizing) || !initialCrop || !image || !canvasRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const dx = toImageCoords(clientX - dragStart.x);
        const dy = toImageCoords(clientY - dragStart.y);

        if (isDragging) {
            setCrop({
                ...initialCrop,
                x: Math.max(0, Math.min(image.width - initialCrop.size, initialCrop.x + dx)),
                y: Math.max(0, Math.min(image.height - initialCrop.size, initialCrop.y + dy))
            });
        } else if (isResizing) {
            // Constrain to 1:1 and image bounds
            const newSize = Math.max(50, Math.min(
                initialCrop.size + dx,
                image.width - initialCrop.x,
                image.height - initialCrop.y
            ));
            setCrop({ ...initialCrop, size: newSize });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, isResizing, initialCrop]);

    const handleRotate = () => {
        // Simple rotation - in a real app we'd bake this into the final canvas
        setRotation(prev => (prev + 90) % 360);
    };

    const handleFilter = () => {
        const filters: ('none' | 'grayscale' | 'sepia' | 'contrast')[] = ['none', 'grayscale', 'sepia', 'contrast'];
        const currentIndex = filters.indexOf(filter);
        setFilter(filters[(currentIndex + 1) % filters.length]);
    };

    const handleSave = () => {
        if (!image) return;
        
        // Final High-Res Crop
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 500; // Standardize profile photo size
        finalCanvas.height = 500;
        const ctx = finalCanvas.getContext('2d');
        if (!ctx) return;

        // Apply filters to high-res output
        let filterString = 'none';
        if (filter === 'grayscale') filterString = 'grayscale(100%)';
        if (filter === 'sepia') filterString = 'sepia(100%)';
        if (filter === 'contrast') filterString = 'contrast(150%)';
        ctx.filter = filterString;

        // Draw the cropped portion
        ctx.drawImage(
            image,
            crop.x, crop.y, crop.size, crop.size, // Source
            0, 0, 500, 500 // Destination
        );

        onSave(finalCanvas.toDataURL('image/jpeg', 0.9));
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in backdrop-blur-md">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-slate-100">Adjust Portrait</h3>
                        <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-widest">Crop and enhance your profile</p>
                    </div>
                    <button onClick={onCancel} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div 
                    ref={containerRef}
                    className="relative bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center h-full min-h-[300px] mb-8 select-none touch-none border border-slate-700"
                >
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain pointer-events-none" />
                    
                    {/* The Crop Mask/Overlay */}
                    {image && canvasRef.current && (
                        <div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{ 
                                width: canvasRef.current.width, 
                                height: canvasRef.current.height,
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {/* Backdrop shadow mask */}
                            <div className="absolute inset-0 bg-black/50"></div>
                            
                            {/* Draggable Crop Area */}
                            <div 
                                className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] cursor-move pointer-events-auto"
                                style={{
                                    left: toDisplayCoords(crop.x),
                                    top: toDisplayCoords(crop.y),
                                    width: toDisplayCoords(crop.size),
                                    height: toDisplayCoords(crop.size),
                                }}
                                onMouseDown={(e) => handleMouseDown(e, 'drag')}
                                onTouchStart={(e) => handleMouseDown(e, 'drag')}
                            >
                                {/* Rule of Thirds Grid */}
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-b border-white/50"></div>
                                    <div className="border-r border-white/50"></div>
                                    <div className="border-r border-white/50"></div>
                                    <div></div>
                                </div>

                                {/* Resize Handle */}
                                <div 
                                    className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-center justify-center bg-white rounded-tl-xl shadow-lg group pointer-events-auto"
                                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize'); }}
                                >
                                    <div className="w-1 h-1 bg-slate-400 rounded-full mr-1"></div>
                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={handleRotate} className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl text-gray-700 dark:text-slate-200 hover:bg-gray-100 transition-all font-bold text-xs uppercase tracking-widest">
                        <RotateLeftIcon className="w-5 h-5 text-indigo-400" />
                        <span>Rotate</span>
                    </button>
                    <button onClick={handleFilter} className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl text-gray-700 dark:text-slate-200 hover:bg-gray-100 transition-all font-bold text-xs uppercase tracking-widest">
                        <WandIcon className="w-5 h-5 text-pink-400" />
                        <span>{filter === 'none' ? 'Filter' : filter}</span>
                    </button>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full bg-[#E18AAA] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-sm"
                >
                    <SaveIcon className="w-6 h-6" /> Commit Changes
                </button>
            </div>
        </div>
    );
};

export default ImageEditor;
