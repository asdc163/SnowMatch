
import React, { useState, useEffect } from 'react';
import { Instructor, Resort } from '../types';
import { Star, Languages, MessageCircle, RotateCw, Sparkles, MapPin, Clock, Award, Heart, ChevronDown, Calendar, Search, Timer, BadgeCheck, ShieldPlus, User } from 'lucide-react';
import { MOCK_RESORTS } from '../services/mockData';

interface SwipeDeckProps {
    instructors: Instructor[];
    onContact: (instructor: Instructor) => void;
    bookingContext: { resort: Resort; date: Date; time: string };
    onUpdateContext: (resortId: string, date: string, time: string) => void;
    favorites: string[];
    onToggleFavorite: (id: string) => void;
}

// === CARD COMPONENT ===
const Card = React.memo(({ 
    instructor, isActive, offset, isFlipped, onFlip, onContact, onClick, isFavorite, onToggleFavorite, currency
}: { 
    instructor: Instructor; 
    isActive: boolean; 
    offset: number; 
    isFlipped: boolean; 
    onFlip: () => void; 
    onContact: (i: Instructor) => void;
    onClick: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    currency: string;
}) => {
    
    // 3D Visual Constants
    const translateX = offset * 105; // Spacing
    const scale = isActive ? 1.0 : 0.95;
    const opacity = isActive ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.4);
    // Use lower base z-index for cards so they don't overlap header
    const zIndex = 10 - Math.abs(offset); 
    const rotateY = offset * -2; 

    // Certificate Color Logic
    const getCertStyle = (level: number) => {
        if (level >= 4) return 'bg-yellow-50 text-yellow-700 border-yellow-200'; // Gold
        if (level === 3) return 'bg-slate-50 text-slate-600 border-slate-200';   // Silver
        return 'bg-orange-50 text-orange-700 border-orange-200';                 // Bronze
    };

    const holoStyle: React.CSSProperties = isActive ? {
        background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.05) 60%, transparent 80%)',
        backgroundSize: '200% 100%',
        mixBlendMode: 'overlay',
        animation: 'holo 4s ease-in-out infinite',
        pointerEvents: 'none',
    } : {};

    return (
        <div 
            className="absolute top-2 left-0 right-0 mx-auto w-[92vw] max-w-[400px] h-[78vh] max-h-[750px] transition-all duration-300 ease-out"
            style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex: zIndex,
                opacity: opacity,
                perspective: '1000px',
            }}
            onClick={onClick}
        >
            <div 
                className="relative w-full h-full transition-transform duration-700 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[32px]"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isActive && isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* === CARD FRONT === */}
                <div 
                    className="absolute inset-0 w-full h-full bg-white rounded-[32px] overflow-hidden border border-slate-100 backface-hidden flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
                >
                    {/* Image Section */}
                    <div className="h-[38%] relative shrink-0 bg-slate-100">
                        <img 
                            src={instructor.photoUrl} 
                            alt={instructor.name} 
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                        
                        {/* Experience Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm border border-white/50 flex items-center gap-1.5">
                            <Timer size={14} className="text-cyan-600" />
                            <span className="text-xs font-bold text-slate-800">{instructor.yearsExperience}y Exp.</span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="h-[62%] bg-white px-5 py-4 flex flex-col relative">
                        
                        {/* Name & Rating */}
                        <div className="flex justify-between items-start mb-2 shrink-0">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
                                    {instructor.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-bold text-sm text-slate-700">{instructor.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">({instructor.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-cyan-50 px-3 py-2 rounded-lg border border-cyan-100 flex items-baseline gap-1 shadow-sm">
                                    <span className="text-xl font-black text-cyan-700">{currency}{instructor.hourlyRate}</span>
                                    <span className="text-[11px] text-cyan-600 font-bold uppercase">/hr</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2 mb-2 pb-1 shrink-0">
                            {instructor.certifications && instructor.certifications.map((cert, i) => (
                                <div key={i} className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${getCertStyle(cert.level)}`}>
                                    <Award size={14} />
                                    {cert.body} Lvl {cert.level}
                                </div>
                            ))}
                            
                            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide">
                                <BadgeCheck size={14} /> First Aid
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                            <div className="flex items-start gap-2 shrink-0">
                                <Sparkles size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                                <div className="flex flex-wrap gap-1.5">
                                    {instructor.specialties.slice(0,4).map((spec, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[11px] font-bold rounded border border-cyan-100">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-2 shrink-0">
                                <Languages size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                <div className="flex flex-wrap gap-1.5">
                                    {instructor.languages.map(lang => (
                                        <span key={lang} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded border border-slate-100">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 mt-1 border-t border-slate-50 flex flex-col min-h-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-1 shrink-0">
                                    <User size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">About Me</span>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-1">
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap break-words">
                                        {instructor.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-slate-50 flex gap-3 z-20 shrink-0">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                                className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl transition-colors border-2 shadow-sm ${isFavorite ? 'bg-pink-50 border-pink-100 text-pink-500' : 'bg-white border-slate-100 text-slate-300 hover:text-pink-400 hover:border-pink-100'}`}
                            >
                                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onContact(instructor); }}
                                className="flex-1 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-cyan-200/50 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                            >
                                <MessageCircle size={18} fill="white" className="opacity-50" />
                                Contact
                            </button>
                        </div>
                        
                        <div className="absolute inset-0 z-0 pointer-events-none rounded-[32px]" style={holoStyle}></div>
                    </div>
                </div>

                {/* === CARD BACK === */}
                <div 
                    className="absolute inset-0 w-full h-full bg-slate-900 rounded-[32px] overflow-hidden border-[4px] border-cyan-500 backface-hidden shadow-2xl p-8 text-white flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                     <div className="flex items-center justify-between mb-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <img src={instructor.photoUrl} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="avatar" />
                            <div>
                                <h3 className="font-bold text-cyan-300 text-lg leading-none mb-1">{instructor.name}</h3>
                                <div className="flex flex-col gap-1">
                                    {instructor.certifications && instructor.certifications.map((c, i) => (
                                        <div key={i} className="text-xs text-slate-400">
                                            {c.body}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onFlip(); }} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <RotateCw size={20} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
                        <div className="relative">
                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full opacity-50"></div>
                            <p className="text-base leading-relaxed font-light text-slate-200">"{instructor.bio}"</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Teaching Since</div>
                                <div className="text-xl font-bold text-white">{new Date().getFullYear() - instructor.yearsExperience}</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Base Resort</div>
                                <div className="text-white font-bold truncate">{instructor.location}</div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); onContact(instructor); }} className="w-full mt-6 py-4 bg-white text-cyan-950 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors">
                         <MessageCircle size={20} /> Contact Now
                    </button>
                </div>
            </div>
        </div>
    );
});

const SwipeDeck: React.FC<SwipeDeckProps> = ({ 
    instructors, 
    onContact, 
    bookingContext, 
    onUpdateContext,
    favorites,
    onToggleFavorite
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
    
    // Header Edit Mode State
    const [editing, setEditing] = useState<'resort' | 'date' | 'time' | null>(null);
    const [tempResort, setTempResort] = useState(bookingContext.resort.id);
    const [tempDate, setTempDate] = useState(bookingContext.date.toISOString().split('T')[0]);
    const [tempTime, setTempTime] = useState(bookingContext.time);

    // Sync temp state when editing opens or context changes
    useEffect(() => {
        if (editing) {
            setTempResort(bookingContext.resort.id);
            setTempDate(bookingContext.date.toISOString().split('T')[0]);
            setTempTime(bookingContext.time);
        }
    }, [editing, bookingContext]);

    useEffect(() => {
        if (currentIndex >= instructors.length && instructors.length > 0) {
            setCurrentIndex(0);
        }
    }, [instructors.length]);

    const handleFlip = (index: number) => {
        setFlippedIndices(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const handleSaveContext = () => {
        onUpdateContext(tempResort, tempDate, tempTime);
        setEditing(null);
    };

    const getCurrency = (country: string) => {
        switch(country) {
            case 'Japan': return '¥';
            case 'USA': return '$';
            case 'Canada': return 'C$';
            case 'France': 
            case 'Austria':
            case 'Italy':
                return '€';
            case 'Switzerland': return 'CHF';
            case 'UK': return '£';
            default: return '$';
        }
    };

    const currency = bookingContext.resort ? getCurrency(bookingContext.resort.country) : '$';

    // Touch Swipe Logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;
    
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }
    
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }
    
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
             if (currentIndex < instructors.length - 1) {
                 setFlippedIndices(new Set());
                 setCurrentIndex(prev => prev + 1);
             }
        }
        
        if (isRightSwipe) {
            if (currentIndex > 0) {
                setFlippedIndices(new Set());
                setCurrentIndex(prev => prev - 1);
            }
        }
    }

    return (
        <div 
            className="relative w-full h-full overflow-hidden bg-slate-50 flex flex-col"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            
            {/* Header / Context Bar - Interactive */}
            {/* CRITICAL FIX: z-50 to ensure it's above the cards (z-10) */}
            <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-4 pb-2">
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                    {/* Resort Button */}
                    <button 
                        onClick={() => { setEditing(editing === 'resort' ? null : 'resort'); }}
                        className={`flex-1 flex items-center justify-center gap-1 h-10 px-3 rounded-full border text-xs font-bold transition-all truncate shadow-sm ${editing === 'resort' ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105' : 'bg-white/90 backdrop-blur-sm text-slate-600 border-slate-200 hover:border-cyan-400'}`}
                    >
                        <MapPin size={12} className={editing === 'resort' ? 'text-white' : 'text-cyan-500'} />
                        <span className="truncate max-w-[100px]">{bookingContext.resort.name}</span>
                        <ChevronDown size={10} className="opacity-50" />
                    </button>

                    {/* Date Button */}
                    <button 
                         onClick={() => { setEditing(editing === 'date' ? null : 'date'); }}
                         className={`shrink-0 flex items-center justify-center gap-1 h-10 px-3 rounded-full border text-xs font-bold transition-all shadow-sm ${editing === 'date' ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105' : 'bg-white/90 backdrop-blur-sm text-slate-600 border-slate-200 hover:border-cyan-400'}`}
                    >
                        <Calendar size={12} className={editing === 'date' ? 'text-white' : 'text-cyan-500'} />
                        {bookingContext.date.toLocaleDateString([], {month:'numeric', day:'numeric'})}
                    </button>

                    {/* Time Button */}
                     <button 
                         onClick={() => { setEditing(editing === 'time' ? null : 'time'); }}
                         className={`shrink-0 flex items-center justify-center gap-1 h-10 px-3 rounded-full border text-xs font-bold transition-all shadow-sm ${editing === 'time' ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105' : 'bg-white/90 backdrop-blur-sm text-slate-600 border-slate-200 hover:border-cyan-400'}`}
                    >
                        <Clock size={12} className={editing === 'time' ? 'text-white' : 'text-cyan-500'} />
                        {bookingContext.time}
                    </button>
                </div>

                {/* === EDIT DROPDOWN/POPOVER === */}
                {editing && (
                    <>
                        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" onClick={() => setEditing(null)}></div>
                        <div className="absolute top-16 left-0 right-0 mx-auto w-[92%] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                             
                             {editing === 'resort' && (
                                 <div className="space-y-4">
                                     <div className="flex items-center gap-2 mb-1">
                                         <MapPin size={16} className="text-cyan-600"/>
                                         <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Change Location</h3>
                                     </div>
                                     <select 
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all appearance-none text-slate-900"
                                        value={tempResort}
                                        onChange={(e) => setTempResort(e.target.value)}
                                     >
                                        {MOCK_RESORTS.map(r => (
                                            <option key={r.id} value={r.id}>{r.name} ({r.region})</option>
                                        ))}
                                     </select>
                                 </div>
                             )}

                            {editing === 'date' && (
                                 <div className="space-y-4">
                                      <div className="flex items-center gap-2 mb-1">
                                         <Calendar size={16} className="text-cyan-600"/>
                                         <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Change Date</h3>
                                     </div>
                                     <input 
                                        type="date"
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-slate-900"
                                        value={tempDate}
                                        onChange={(e) => setTempDate(e.target.value)}
                                     />
                                 </div>
                             )}

                            {editing === 'time' && (
                                 <div className="space-y-4">
                                      <div className="flex items-center gap-2 mb-1">
                                         <Clock size={16} className="text-cyan-600"/>
                                         <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Change Time</h3>
                                     </div>
                                     <input 
                                        type="time"
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all text-slate-900"
                                        value={tempTime}
                                        onChange={(e) => setTempTime(e.target.value)}
                                     />
                                 </div>
                             )}

                             <button 
                                onClick={handleSaveContext}
                                className="w-full mt-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-base shadow-lg shadow-cyan-200/50 transition-all"
                             >
                                 Apply & Search
                             </button>
                        </div>
                    </>
                )}
            </div>

            {/* Deck Area */}
            <div className="relative flex-1 w-full max-w-md mx-auto mt-16 mb-20 perspective-1000">
                {instructors.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-center px-8 pb-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-700 mb-2">No instructors found</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Try changing your filter settings or looking for a different date.
                        </p>
                        <button 
                            onClick={() => setEditing('resort')}
                            className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all"
                        >
                            Change Search
                        </button>
                     </div>
                ) : (
                    <div className="w-full h-full relative flex items-center justify-center">
                        {instructors.map((instructor, index) => {
                            const offset = index - currentIndex;
                            
                            // Optimization: Only render visible range
                            if (Math.abs(offset) > 2) return null;

                            return (
                                <Card 
                                    key={instructor.id}
                                    instructor={instructor}
                                    isActive={index === currentIndex}
                                    offset={offset}
                                    isFlipped={flippedIndices.has(index)}
                                    onFlip={() => handleFlip(index)}
                                    onContact={onContact}
                                    onClick={() => setCurrentIndex(index)}
                                    isFavorite={favorites.includes(instructor.id)}
                                    onToggleFavorite={() => onToggleFavorite(instructor.id)}
                                    currency={currency}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
            
            {/* Pagination / Status Indicators */}
            {instructors.length > 0 && (
                 <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                    {instructors.map((_, i) => (
                         <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-cyan-500' : 'w-1.5 bg-slate-200'}`} 
                        />
                    ))}
                 </div>
            )}
        </div>
    );
};

export default SwipeDeck;
