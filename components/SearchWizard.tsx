
import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { MOCK_RESORTS, MOCK_INSTRUCTORS } from '../services/mockData';
import { Resort } from '../types';

interface SearchWizardProps {
  onSearchComplete: (resort: Resort, date: Date) => void;
}

const SearchWizard: React.FC<SearchWizardProps> = ({ onSearchComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 State: Date & Time
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');

  // Step 2 State: Location
  const [region, setRegion] = useState<string>('');
  const [resortId, setResortId] = useState<string>('');

  // === FILTER LOGIC ===
  // Only show resorts/regions that actually have instructors available
  const { validRegions, validResorts } = useMemo(() => {
      // 1. Get all resort IDs that are covered by at least one instructor
      const resortIdsWithInstructors = new Set(
          MOCK_INSTRUCTORS.flatMap(inst => inst.availableResorts)
      );

      // 2. Filter the master resort list to only include those with instructors
      const activeResorts = MOCK_RESORTS.filter(r => 
          resortIdsWithInstructors.has(r.id)
      );

      // 3. Extract unique regions from the active resorts only
      const activeRegions = Array.from(new Set(activeResorts.map(r => r.region)));

      return { validRegions: activeRegions, validResorts: activeResorts };
  }, []);

  // Filter the VALID resorts based on the selected region
  const filteredResorts = validResorts.filter(r => r.region === region);
  const selectedResort = validResorts.find(r => r.id === resortId);

  const handleNext = () => {
      if (step === 1 && date && time) setStep(2);
  };

  const handleFinalSubmit = () => {
      if (selectedResort && date && time) {
        onSearchComplete(selectedResort, new Date(`${date}T${time}`));
      }
  };

  // Get today's date string for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative">
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 pt-4 px-6 mb-2 shrink-0">
        {[1, 2].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${s <= step ? 'bg-cyan-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="max-w-md mx-auto w-full min-h-full flex flex-col">
            
            {/* STEP 1: DATE & TIME */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                    <div className="mb-4 mt-2">
                        <span className="inline-block p-3 bg-cyan-100 text-cyan-700 rounded-2xl mb-4">
                            <Calendar size={24} />
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">When are we <br/>riding?</h2>
                        <p className="text-slate-500 text-sm">前往滑雪的日期，時間</p>
                    </div>

                    <div className="space-y-6">
                        {/* Date Input - STANDARD HTML */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Ski Date</label>
                            <input 
                                type="date" 
                                min={today}
                                required
                                className="w-full h-16 px-4 rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Time Input - STANDARD HTML */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                            <input 
                                type="time" 
                                required
                                className="w-full h-16 px-4 rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-auto pt-10">
                        <button 
                            disabled={!date || !time}
                            onClick={handleNext}
                            className="w-full py-4 bg-cyan-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-cyan-200/50 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            Next Step <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: LOCATION */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                    <div className="mb-4 mt-2">
                        <span className="inline-block p-3 bg-cyan-100 text-cyan-700 rounded-2xl mb-4">
                            <MapPin size={24} />
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Where are you <br/>heading?</h2>
                        <p className="text-slate-500 text-sm">Select your destination.</p>
                    </div>

                    <div className="space-y-6">
                        
                        {/* Region Select - STANDARD HTML */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Region</label>
                            <div className="relative">
                                <select 
                                    className="w-full h-16 px-4 rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all appearance-none"
                                    value={region}
                                    onChange={(e) => {
                                        setRegion(e.target.value);
                                        setResortId(''); 
                                    }}
                                >
                                    <option value="" disabled>Select Region</option>
                                    {validRegions.length > 0 ? (
                                        validRegions.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No active regions</option>
                                    )}
                                </select>
                                {/* Simple pointer events none icon for visual hint */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight className="rotate-90" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Resort Select - STANDARD HTML */}
                        <div className={`transition-opacity duration-300 ${!region ? 'opacity-50' : 'opacity-100'}`}>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Resort</label>
                            <div className="relative">
                                <select 
                                    className="w-full h-16 px-4 rounded-xl border border-slate-200 bg-white text-lg font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all appearance-none disabled:bg-slate-100"
                                    value={resortId}
                                    disabled={!region}
                                    onChange={(e) => setResortId(e.target.value)}
                                >
                                    <option value="" disabled>Select Resort</option>
                                    {filteredResorts.map(r => (
                                        <option key={r.id} value={r.id}>{r.name} ({r.country})</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight className="rotate-90" size={20} />
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="mt-auto space-y-3 mb-4 pt-10">
                         <button 
                            disabled={!resortId}
                            onClick={handleFinalSubmit}
                            className="w-full py-4 bg-cyan-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-cyan-200/50 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            Find Instructors <ArrowRight size={20} />
                        </button>
                        
                        <button 
                            onClick={() => setStep(1)}
                            className="w-full py-2 text-sm text-slate-400 font-bold hover:text-slate-600"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default SearchWizard;
