
import React, { useState } from 'react';
import { UserRole, CertBody, Certification } from '../types';
import { Loader2, Wand2, Info, ChevronRight, User, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { MOCK_STUDENT } from '../services/mockData';

interface OnboardingFormProps {
  onComplete: (data: any) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [view, setView] = useState<'landing' | 'form'>('landing');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Instructor Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/400/600');
  
  // Multi-Certification State
  const [certifications, setCertifications] = useState<Certification[]>([
      { body: CertBody.CSIA, level: 1, licenseNumber: '' }
  ]);

  const [experience, setExperience] = useState(1);
  const [specialties, setSpecialties] = useState('');
  
  const handleStudentEntry = () => {
      onComplete(MOCK_STUDENT);
  };

  const handleInstructorEntry = () => {
      setRole(UserRole.INSTRUCTOR);
      setView('form');
  };

  // Cert Helpers
  const addCert = () => {
      setCertifications([...certifications, { body: CertBody.CSIA, level: 1, licenseNumber: '' }]);
  };

  const removeCert = (index: number) => {
      if (certifications.length > 1) {
          const newCerts = [...certifications];
          newCerts.splice(index, 1);
          setCertifications(newCerts);
      }
  };

  const updateCert = (index: number, field: keyof Certification, value: any) => {
      const newCerts = [...certifications];
      newCerts[index] = { ...newCerts[index], [field]: value };
      setCertifications(newCerts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commonData = { name, email, location, bio, photoUrl, role };
    
    // Instructor Submit
    onComplete({ 
      ...commonData, 
      certifications: certifications,
      yearsExperience: Number(experience), 
      specialties: specialties.split(',').map(s => s.trim()) 
    });
  };

  if (view === 'landing') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 p-6 flex flex-col justify-center text-white">
            <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">SnowMatch</h1>
                    <p className="text-cyan-100 text-lg">Find your perfect line.</p>
                </div>

                <div className="space-y-4">
                    {/* Student Button */}
                    <button 
                        onClick={handleStudentEntry}
                        className="w-full bg-white text-slate-900 p-6 rounded-3xl shadow-xl flex items-center justify-between group transition-transform active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                <User size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">I'm a Student</h3>
                                <p className="text-slate-500 text-sm">Find an instructor & book</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                    </button>

                    {/* Instructor Button */}
                    <button 
                        onClick={handleInstructorEntry}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white p-6 rounded-3xl flex items-center justify-between group transition-transform active:scale-95 hover:bg-white/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <GraduationCap size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">I'm an Instructor</h3>
                                <p className="text-white/60 text-sm">Create profile & get booked</p>
                            </div>
                        </div>
                        <ChevronRight className="text-white/50 group-hover:text-white transition-colors" />
                    </button>
                </div>

                <p className="text-center text-white/40 text-xs mt-12">
                    By continuing, you agree to our Terms of Service.
                </p>
            </div>
        </div>
      );
  }

  // Instructor Registration Form
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <button onClick={() => setView('landing')} className="text-sm text-slate-400 font-bold mb-6 hover:text-slate-600">
            ← Back
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Instructor Profile</h1>
        <p className="text-slate-500 mb-8">Showcase your skills to students.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none text-slate-900 font-bold" placeholder="Snowy McSkier" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email (Private)</label>
            <input required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none text-slate-900 font-bold" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Home Resort / Base</label>
            <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none text-slate-900 font-bold" placeholder="e.g. Niseko" value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          {/* Certifications Section */}
          <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-cyan-800 flex items-center gap-2">
                    <Info size={16}/> Certifications
                </h3>
            </div>
            
            <div className="space-y-4">
                {certifications.map((cert, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-cyan-200 shadow-sm relative">
                        {index > 0 && (
                            <button 
                                type="button" 
                                onClick={() => removeCert(index)}
                                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                        
                        <div className="mb-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Body</label>
                            <select 
                                className="w-full px-2 py-2 rounded-md bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
                                value={cert.body}
                                onChange={e => updateCert(index, 'body', e.target.value)}
                            >
                                {Object.values(CertBody).map(cb => (
                                    <option key={cb} value={cb}>{cb}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-1/3">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Level</label>
                                <select 
                                    className="w-full px-2 py-2 rounded-md bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900" 
                                    value={cert.level} 
                                    onChange={e => updateCert(index, 'level', Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4].map(l => <option key={l} value={l}>Lvl {l}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">License No.</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-2 py-2 rounded-md bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900" 
                                    placeholder="e.g. 12345"
                                    value={cert.licenseNumber} 
                                    onChange={e => updateCert(index, 'licenseNumber', e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                type="button" 
                onClick={addCert}
                className="w-full mt-3 py-2 border-2 border-dashed border-cyan-300 text-cyan-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-cyan-100"
            >
                <Plus size={14}/> Add Another Cert
            </button>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Teaching Years</label>
             <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none" value={experience} onChange={e => setExperience(Number(e.target.value))} />
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Specialties (comma separated)</label>
             <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold outline-none" placeholder="Powder, Park, Kids..." value={specialties} onChange={e => setSpecialties(e.target.value)} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700">Bio</label>
            </div>
            <textarea 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 outline-none h-24 resize-none text-slate-900 font-medium" 
                placeholder="Tell students why they should pick you..." 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
            />
          </div>

          <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-200 transition-all mt-4 transform active:scale-95">
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;
