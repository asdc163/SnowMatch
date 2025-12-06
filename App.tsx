
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Student, Instructor, Match, Resort, CertBody, Certification, ChatMessage } from './types';
import OnboardingForm from './components/OnboardingForm';
import SwipeDeck from './components/SwipeDeck';
import SearchWizard from './components/SearchWizard';
import Navigation from './components/Navigation';
import { HeartHandshake, LogOut, CheckCircle, Heart, MapPin, Star, User, Flag, Users, Clock, BookOpen, PenLine, X, ChevronRight, Save, Camera, Check, XCircle, Calendar, MessageCircle, Mail, Trash2, Plus, Info, Award, Inbox, ArrowLeft, Send, Lock } from 'lucide-react';
import { MOCK_INSTRUCTORS, MOCK_RESORTS, MOCK_STUDENT } from './services/mockData';

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hong Kong", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Student | Instructor | null>(null);
  const [activeTab, setActiveTab] = useState('match');
  const [matches, setMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Chat State
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Search State
  const [isSearching, setIsSearching] = useState(true);
  const [bookingResort, setBookingResort] = useState<Resort | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState<string>('09:00');
  
  // Modal Flows
  const [showBookingSuccess, setShowBookingSuccess] = useState<Instructor | null>(null);
  const [showProfileRedirectModal, setShowProfileRedirectModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  
  // Toast State
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Profile Edit State (Common)
  const [tempName, setTempName] = useState('');
  const [tempPhoto, setTempPhoto] = useState('');
  const [tempGender, setTempGender] = useState('');
  const [tempNationality, setTempNationality] = useState('');

  // Profile Edit State (Instructor Specific)
  const [tempBio, setTempBio] = useState('');
  const [tempExperience, setTempExperience] = useState(0);
  const [tempSpecialties, setTempSpecialties] = useState('');
  const [tempCerts, setTempCerts] = useState<Certification[]>([]);
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Booking Form State
  const [learnerCount, setLearnerCount] = useState(1);
  const [duration, setDuration] = useState('2 Hours');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');

  // Sync temp state with current user when user changes
  useEffect(() => {
    if (currentUser) {
        setTempName(currentUser.name);
        setTempPhoto(currentUser.photoUrl);
        setTempGender(currentUser.gender || '');
        setTempNationality(currentUser.nationality || '');
        
        if (currentUser.role === UserRole.INSTRUCTOR) {
            const inst = currentUser as Instructor;
            setTempBio(inst.bio);
            setTempExperience(inst.yearsExperience);
            setTempSpecialties(inst.specialties.join(', '));
            setTempCerts(inst.certifications || []);
        }
    }
  }, [currentUser]);

  // Scroll to bottom of chat
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMatch?.messages]);

  const handleOnboardingComplete = (data: any) => {
    const userId = 'user-' + Date.now();
    const newUser = { ...data, id: userId };
    setCurrentUser(newUser);
    
    if (data.role === UserRole.INSTRUCTOR) {
      setActiveTab('requests'); // Instructors go to requests dashboard
      setIsSearching(false);
      
      // Seed Mock Requests
      const mockRequests: Match[] = [
          {
              id: 'req-1',
              studentId: MOCK_STUDENT.id,
              instructorId: userId,
              resortId: 'resort-niseko',
              bookingDate: new Date(Date.now() + 86400000 * 2).toISOString(),
              timestamp: Date.now(),
              status: 'pending',
              learnerCount: 2,
              duration: '3 Hours',
              content: 'Intermediate carving and parallel turns',
              notes: 'We are a couple, prefer gentle slopes first.',
              messages: []
          },
          {
              id: 'req-2',
              studentId: 'student-guest-2',
              instructorId: userId,
              resortId: 'resort-niseko',
              bookingDate: new Date(Date.now() + 86400000 * 5).toISOString(),
              timestamp: Date.now() - 3600000,
              status: 'pending',
              learnerCount: 1,
              duration: '6 Hours',
              content: 'Off-piste and powder introduction',
              notes: 'I have my own gear.',
              messages: []
          }
      ];
      setMatches(mockRequests);

    } else {
      setIsSearching(true);
    }
  };

  const handleSearchComplete = (resort: Resort, date: Date) => {
      setBookingResort(resort);
      setBookingDate(date);
      setBookingTime(date.toTimeString().slice(0, 5));
      setIsSearching(false);
      setActiveTab('match');
  };

  const handleUpdateContext = (resortId: string, dateStr: string, timeStr: string) => {
      const realResort = MOCK_RESORTS.find((r: Resort) => r.id === resortId);
      if (realResort) setBookingResort(realResort);
      if (dateStr) setBookingDate(new Date(dateStr));
      if (timeStr) setBookingTime(timeStr);
  };

  const handleContact = (instructor: Instructor) => {
    if (!currentUser || !bookingResort || !bookingDate) return;
    
    setSelectedInstructor(instructor);

    if (!currentUser.gender || !currentUser.nationality || !currentUser.name) {
        setShowProfileRedirectModal(true); 
    } else {
        setShowBookingModal(true);
    }
  };

  // === PROFILE MANAGEMENT ===
  const handleSaveProfile = () => {
      if (currentUser) {
          let updatedUser: Student | Instructor = {
              ...currentUser,
              name: tempName,
              photoUrl: tempPhoto,
              gender: tempGender,
              nationality: tempNationality
          };

          if (currentUser.role === UserRole.INSTRUCTOR) {
              updatedUser = {
                  ...updatedUser,
                  bio: tempBio,
                  yearsExperience: tempExperience,
                  specialties: tempSpecialties.split(',').map(s => s.trim()),
                  certifications: tempCerts,
              } as Instructor;
          }

          setCurrentUser(updatedUser);
          
          setShowSaveToast(true);
          setTimeout(() => setShowSaveToast(false), 3000);
      }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Instructor Cert Management
  const addCert = () => {
      setTempCerts([...tempCerts, { body: CertBody.CSIA, level: 1, licenseNumber: '' }]);
  };

  const removeCert = (index: number) => {
      if (tempCerts.length > 1) {
          const newCerts = [...tempCerts];
          newCerts.splice(index, 1);
          setTempCerts(newCerts);
      }
  };

  const updateCert = (index: number, field: keyof Certification, value: any) => {
      const newCerts = [...tempCerts];
      newCerts[index] = { ...newCerts[index], [field]: value };
      setTempCerts(newCerts);
  };

  const handleGoToProfile = () => {
      setShowProfileRedirectModal(false);
      setActiveTab('profile');
  };

  // === BOOKING LOGIC ===
  const handleSendRequest = () => {
      if (!currentUser || !selectedInstructor || !bookingResort || !bookingDate) return;

      const newMatch: Match = {
        id: Date.now().toString(),
        studentId: currentUser.id,
        instructorId: selectedInstructor.id,
        resortId: bookingResort.id,
        bookingDate: bookingDate.toISOString(),
        timestamp: Date.now(),
        status: 'pending',
        learnerCount,
        duration,
        content,
        notes,
        messages: []
      };

      setMatches([newMatch, ...matches]);
      setShowBookingModal(false);
      setShowBookingSuccess(selectedInstructor);
  };

  const handleAcceptRequest = (matchId: string) => {
      setMatches(prev => prev.map(m => {
          if (m.id === matchId) {
              return { 
                  ...m, 
                  status: 'accepted',
                  messages: [
                      {
                          id: 'sys-1',
                          senderId: 'system',
                          content: 'Booking request accepted. You can now chat.',
                          timestamp: Date.now()
                      }
                  ]
              };
          }
          return m;
      }));
  };

  const handleDeclineRequest = (matchId: string) => {
      setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const handleToggleFavorite = (instructorId: string) => {
      setFavorites(prev => 
        prev.includes(instructorId) 
            ? prev.filter(id => id !== instructorId)
            : [...prev, instructorId]
      );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMatches([]);
    setFavorites([]);
    setBookingResort(null);
    setBookingDate(null);
    setIsSearching(true);
    setActiveTab('match');
    setActiveChatMatch(null);
  };

  // === CHAT LOGIC ===
  const handleSendMessage = () => {
      if (!chatInput.trim() || !activeChatMatch || !currentUser) return;

      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          content: chatInput,
          timestamp: Date.now()
      };

      // Update Matches State
      const updatedMatches = matches.map(m => {
          if (m.id === activeChatMatch.id) {
              return { ...m, messages: [...m.messages, newMessage] };
          }
          return m;
      });

      setMatches(updatedMatches);
      // Update Active Chat View (Needed because local state is derived)
      setActiveChatMatch(updatedMatches.find(m => m.id === activeChatMatch.id) || null);
      
      setChatInput('');
  };

  const filteredInstructors = MOCK_INSTRUCTORS.filter(inst => {
      if (!bookingResort) return true;
      return inst.availableResorts.includes(bookingResort.id);
  });

  const favoriteInstructors = MOCK_INSTRUCTORS.filter(inst => favorites.includes(inst.id));

  if (!currentUser) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  // Render Search Wizard
  if (currentUser.role === UserRole.STUDENT && isSearching) {
      return (
          <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
              <div className="h-14 flex items-center justify-center bg-white border-b border-slate-100 shrink-0">
                <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 text-xl tracking-tighter">
                SnowMatch
                </h1>
            </div>
            <div className="flex-1 relative overflow-hidden flex flex-col">
                <SearchWizard onSearchComplete={handleSearchComplete} />
            </div>
          </div>
      )
  }

  // === CHAT ROOM VIEW ===
  if (activeChatMatch) {
      const isStudent = currentUser.role === UserRole.STUDENT;
      const otherUser = isStudent 
        ? MOCK_INSTRUCTORS.find(i => i.id === activeChatMatch.instructorId)
        : (activeChatMatch.studentId === 'student-demo' ? MOCK_STUDENT : { name: 'Guest Student', photoUrl: 'https://i.pravatar.cc/150?u=' + activeChatMatch.studentId });
      
      const resort = MOCK_RESORTS.find(r => r.id === activeChatMatch.resortId);
      const isPending = activeChatMatch.status === 'pending';

      return (
          <div className="fixed inset-0 bg-slate-50 flex flex-col z-50">
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 shrink-0 shadow-sm z-20">
                  <button onClick={() => setActiveChatMatch(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                      <ArrowLeft size={20} className="text-slate-600"/>
                  </button>
                  <img src={otherUser?.photoUrl} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                  <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{otherUser?.name}</h3>
                      <p className="text-[10px] font-bold flex items-center gap-1">
                          {isPending ? (
                              <span className="text-yellow-500 flex items-center gap-1"><Clock size={10}/> Waiting for Accept</span>
                          ) : (
                              <span className="text-green-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online</span>
                          )}
                      </p>
                  </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  
                  {/* Booking Context Card */}
                  <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4 shadow-sm mx-2">
                      <div className="flex justify-between items-start mb-3 border-b border-cyan-100/50 pb-2">
                          <div className="flex items-center gap-2 text-cyan-800 font-black text-xs uppercase tracking-wide">
                              <Calendar size={12}/> Booking Details
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isPending ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-white text-cyan-600 border-cyan-100'}`}>
                              {isPending ? 'Request Pending' : 'Confirmed'}
                          </span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                              <MapPin size={14} className="text-cyan-500"/> {resort?.name}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                              <Clock size={14} className="text-cyan-500"/> {activeChatMatch.duration}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 font-medium col-span-2">
                              <Users size={14} className="text-cyan-500"/> {activeChatMatch.learnerCount} Learner{activeChatMatch.learnerCount && activeChatMatch.learnerCount > 1 ? 's' : ''}
                          </div>
                          <div className="col-span-2 bg-white/50 p-2 rounded-lg text-xs text-slate-600 mt-1 italic">
                              "{activeChatMatch.content}"
                          </div>
                      </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 pb-4">
                      {activeChatMatch.messages.map(msg => {
                          const isMe = msg.senderId === currentUser.id;
                          const isSystem = msg.senderId === 'system';

                          if (isSystem) {
                              return (
                                  <div key={msg.id} className="flex justify-center my-4">
                                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                          {msg.content}
                                      </span>
                                  </div>
                              );
                          }

                          return (
                              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${isMe ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                                      {msg.content}
                                  </div>
                              </div>
                          );
                      })}
                      <div ref={chatEndRef} />
                  </div>
              </div>

              {/* Input Area */}
              <div className="bg-white p-3 border-t border-slate-100 shrink-0 pb-safe">
                  <div className={`flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border ${isPending ? 'border-slate-100 opacity-60' : 'border-slate-200'}`}>
                      {isPending && (
                          <div className="pl-3">
                              <Lock size={16} className="text-slate-400"/>
                          </div>
                      )}
                      <input 
                        type="text" 
                        value={chatInput}
                        disabled={isPending}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSendMessage()}
                        placeholder={isPending ? "Waiting for instructor to accept..." : "Type a message..."}
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400 disabled:cursor-not-allowed"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isPending}
                        className="p-2 bg-cyan-600 text-white rounded-full disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors shadow-md"
                      >
                          <Send size={18} />
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // === MAIN APP VIEW ===
  return (
    <div className="fixed inset-0 w-full bg-slate-50 flex flex-col">
      
      {/* Top Bar - Hide on Student Match tab to let SwipeDeck header show */}
      {!(currentUser.role === UserRole.STUDENT && activeTab === 'match') && activeTab !== 'messages' && (
        <div className="h-14 flex items-center justify-center bg-white border-b border-slate-100 shrink-0 px-4 z-30">
            <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 text-xl tracking-tighter">
            SnowMatch
            </h1>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50 w-full no-scrollbar">
        
        {/* STUDENT: SWIPE VIEW */}
        {currentUser.role === UserRole.STUDENT && activeTab === 'match' && bookingResort && bookingDate && (
          <SwipeDeck 
            instructors={filteredInstructors} 
            onContact={handleContact} 
            bookingContext={{ 
                resort: bookingResort, 
                date: bookingDate,
                time: bookingTime
            }}
            onUpdateContext={handleUpdateContext}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* INSTRUCTOR: REQUESTS DASHBOARD */}
        {currentUser.role === UserRole.INSTRUCTOR && activeTab === 'requests' && (
            <div className="p-6 pb-32 max-w-md mx-auto min-h-full">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    Booking Requests <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{matches.filter(m => m.status === 'pending').length}</span>
                </h2>
                
                {matches.filter(m => m.status === 'pending').length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No pending requests.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {matches.filter(m => m.status === 'pending').map(match => {
                            const student = match.studentId === 'student-demo' ? MOCK_STUDENT : { name: 'Guest Student', level: 'Beginner', photoUrl: 'https://i.pravatar.cc/150?u=' + match.studentId };
                            const resort = MOCK_RESORTS.find(r => r.id === match.resortId);

                            return (
                                <div key={match.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img src={student.photoUrl} className="w-14 h-14 rounded-full object-cover bg-slate-100" />
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                                                    <Flag size={12}/> {MOCK_STUDENT.nationality || 'International'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100 flex items-center gap-1">
                                                <Users size={12}/> {match.learnerCount} Learner{match.learnerCount && match.learnerCount > 1 ? 's' : ''}
                                            </span>
                                            <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100 flex items-center gap-1">
                                                <Clock size={12}/> {match.duration}
                                            </span>
                                        </div>

                                        <div className="bg-cyan-50 rounded-xl p-4 mb-2">
                                            <div className="flex items-center gap-2 mb-2 text-cyan-800 font-bold text-xs uppercase tracking-wide">
                                                <Calendar size={14}/> {new Date(match.bookingDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                                                <MapPin size={16} className="text-cyan-600"/> {resort?.name}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Wants to learn</p>
                                                <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl">{match.content}</p>
                                            </div>
                                            {match.notes && (
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Notes</p>
                                                    <p className="text-sm text-slate-600 italic">"{match.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex p-3 gap-3 bg-slate-50">
                                        <button 
                                            onClick={() => handleDeclineRequest(match.id)}
                                            className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                                        >
                                            <XCircle size={18}/> Decline
                                        </button>
                                        <button 
                                            onClick={() => handleAcceptRequest(match.id)}
                                            className="flex-1 py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-md shadow-cyan-200 flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors"
                                        >
                                            <CheckCircle size={18}/> Accept
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* FAVORITES VIEW */}
        {activeTab === 'favorites' && (
            <div className="p-6 pb-32 max-w-md mx-auto min-h-full">
                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Saved Instructors</h2>
                {favoriteInstructors.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Heart size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No saved instructors yet.</p>
                        <button onClick={() => setActiveTab('match')} className="mt-4 text-cyan-600 font-bold text-sm">
                            Go Explore
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {favoriteInstructors.map(inst => (
                            <div key={inst.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                                <img src={inst.photoUrl} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 text-lg">{inst.name}</h3>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500"/>
                                            <span className="text-xs font-bold text-slate-700">{inst.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 truncate">{inst.bio}</p>
                                    <div className="flex gap-2 mt-auto">
                                        <button 
                                            onClick={() => handleContact(inst)}
                                            className="flex-1 bg-cyan-600 text-white text-xs font-bold py-2 rounded-lg"
                                        >
                                            Book
                                        </button>
                                        <button 
                                            onClick={() => handleToggleFavorite(inst.id)}
                                            className="px-3 bg-red-50 text-red-500 rounded-lg border border-red-100"
                                        >
                                            <Heart size={16} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* INSTRUCTOR: PROFILE VIEW - EDITABLE */}
        {(currentUser.role === UserRole.INSTRUCTOR && activeTab === 'profile') && (
            <div className="p-6 pb-32 max-w-md mx-auto">
                 <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-cyan-100 flex items-center gap-4 relative overflow-hidden">
                    <img src={tempPhoto} className="w-20 h-20 rounded-full object-cover bg-slate-200" />
                    <div className="flex-1 min-w-0">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Display Name</label>
                         <input 
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full bg-slate-50 border-b border-slate-200 focus:border-cyan-500 outline-none text-lg font-bold text-slate-800 py-1"
                            placeholder="Your Name"
                         />
                    </div>
                    
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 left-20 bg-white p-1.5 rounded-full shadow-md border border-slate-100 text-cyan-600 hover:scale-110 transition-transform">
                        <Camera size={14} />
                    </button>
                 </div>

                 <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-slate-100 space-y-5">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2"><Award size={16}/> Qualifications</h3>
                     
                     <div className="space-y-4">
                        {tempCerts.map((cert, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                                {index > 0 && (
                                    <button type="button" onClick={() => removeCert(index)} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="mb-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Body</label>
                                    <select 
                                        className="w-full px-2 py-2 rounded-md bg-white border border-slate-200 text-sm font-bold text-slate-900"
                                        value={cert.body}
                                        onChange={e => updateCert(index, 'body', e.target.value)}
                                    >
                                        {Object.values(CertBody).map(cb => <option key={cb} value={cb}>{cb}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Level</label>
                                        <select 
                                            className="w-full px-2 py-2 rounded-md bg-white border border-slate-200 text-sm font-bold text-slate-900" 
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
                                            className="w-full px-2 py-2 rounded-md bg-white border border-slate-200 text-sm font-bold text-slate-900" 
                                            value={cert.licenseNumber} 
                                            onChange={e => updateCert(index, 'licenseNumber', e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addCert} className="w-full py-2 border-2 border-dashed border-cyan-300 text-cyan-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-cyan-50">
                            <Plus size={14}/> Add Certification
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-semibold text-slate-500 mb-1">Experience (Yrs)</label>
                             <input type="number" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold" value={tempExperience} onChange={e => setTempExperience(Number(e.target.value))} />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">Specialties</label>
                         <input type="text" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold" value={tempSpecialties} onChange={e => setTempSpecialties(e.target.value)} />
                     </div>

                     <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">Bio</label>
                         <textarea className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium h-24 resize-none" value={tempBio} onChange={e => setTempBio(e.target.value)} />
                     </div>

                     <button onClick={handleSaveProfile} className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 active:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-100 transition-all">
                         <Save size={16} /> Save Changes
                     </button>
                 </div>

                 <div className="bg-white rounded-3xl shadow-sm p-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-2xl text-red-500 transition-colors">
                        <LogOut size={20} />
                        <span className="font-bold">Log Out</span>
                    </button>
                 </div>
            </div>
        )}

        {/* STUDENT PROFILE VIEW - EDITABLE */}
        {currentUser.role === UserRole.STUDENT && activeTab === 'profile' && (
             <div className="p-6 pb-32 max-w-md mx-auto">
                 <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-cyan-100 flex items-center gap-4 relative overflow-hidden">
                    <img src={tempPhoto} className="w-20 h-20 rounded-full object-cover bg-slate-200" />
                    <div className="flex-1 min-w-0">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Display Name</label>
                         <input 
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full bg-slate-50 border-b border-slate-200 focus:border-cyan-500 outline-none text-lg font-bold text-slate-800 py-1"
                            placeholder="Your Name"
                         />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 left-20 bg-white p-1.5 rounded-full shadow-md border border-slate-100 text-cyan-600 hover:scale-110 transition-transform"><Camera size={14} /></button>
                 </div>
                 <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-slate-100 space-y-4">
                     <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1"><User size={12}/> Gender</label>
                          <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-slate-800" value={tempGender} onChange={(e) => setTempGender(e.target.value)}>
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                          </select>
                     </div>
                     <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1"><Flag size={12}/> Nationality</label>
                          <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-slate-800" value={tempNationality} onChange={(e) => setTempNationality(e.target.value)}>
                              <option value="">Select Nationality</option>
                              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                     </div>
                     <button onClick={handleSaveProfile} className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 active:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-100 transition-all mt-2"><Save size={16} /> Save Changes</button>
                 </div>
                 <div className="bg-white rounded-3xl shadow-sm p-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-2xl text-red-500 transition-colors"><LogOut size={20} /><span className="font-bold">Log Out</span></button>
                 </div>
             </div>
        )}

        {/* MESSAGES VIEW (SHARED) */}
        {activeTab === 'messages' && (
            <div className="p-6 pb-32 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Chats</h2>
                
                {/* List View */}
                {!activeChatMatch && (() => {
                    const myChats = matches.filter(m => 
                        (currentUser?.role === UserRole.INSTRUCTOR && m.instructorId === currentUser.id && m.status === 'accepted') ||
                        (currentUser?.role === UserRole.STUDENT && m.studentId === currentUser.id)
                    );

                    if (myChats.length === 0) {
                        return (
                            <div className="text-center py-12 text-slate-400">
                                <HeartHandshake size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No active chats.</p>
                                <p className="text-sm mt-2">{currentUser?.role === UserRole.STUDENT ? "Book an instructor to start!" : "Accept a request to start!"}</p>
                            </div>
                        );
                    }

                    return (
                        <div className="space-y-4">
                            {myChats.map(m => {
                                let otherName, otherPhoto;
                                if (currentUser?.role === UserRole.STUDENT) {
                                    const inst = MOCK_INSTRUCTORS.find(i => i.id === m.instructorId);
                                    otherName = inst?.name || "Instructor";
                                    otherPhoto = inst?.photoUrl;
                                } else {
                                    otherName = m.studentId === 'student-demo' ? MOCK_STUDENT.name : 'Guest Student';
                                    otherPhoto = m.studentId === 'student-demo' ? MOCK_STUDENT.photoUrl : 'https://i.pravatar.cc/150?u=' + m.studentId;
                                }

                                return (
                                    <div 
                                        key={m.id} 
                                        onClick={() => setActiveChatMatch(m)}
                                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition cursor-pointer"
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                                <img src={otherPhoto} className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${m.status === 'pending' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-800 truncate">{otherName}</h3>
                                                <span className="text-[10px] text-slate-400 font-medium">Today</span>
                                            </div>
                                            {m.status === 'pending' ? (
                                                 <p className="text-xs text-yellow-600 font-bold bg-yellow-50 inline-block px-2 py-0.5 rounded-md">Request Sent • Waiting</p>
                                            ) : (
                                                <p className="text-sm text-slate-600 truncate flex items-center gap-1"><MessageCircle size={14} className="text-cyan-500"/> Start chatting now!</p>
                                            )}
                                            <p className="text-[10px] text-slate-400 mt-1 truncate">{m.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        )}

      </main>

      <Navigation 
        role={currentUser.role} 
        activeTab={activeTab} 
        onTabChange={(tab) => {
            if (tab === 'match' && currentUser.role === UserRole.STUDENT && !bookingResort) {
                setIsSearching(true);
            }
            setActiveTab(tab);
        }} 
        onLogout={handleLogout}
      />

      {/* TOAST */}
      {showSaveToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in">
              <CheckCircle size={18} className="text-green-400" />
              <span className="font-bold text-sm">Profile Saved!</span>
          </div>
      )}

      {/* MODALS */}
      {showProfileRedirectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><User size={32} /></div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Profile Incomplete</h3>
                  <p className="text-sm text-slate-500 mb-6">Please complete your profile details (Name, Gender & Nationality) before contacting an instructor.</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={handleGoToProfile} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-200 flex items-center justify-center gap-2">Go to Profile <ChevronRight size={16} /></button>
                      <button onClick={() => setShowProfileRedirectModal(false)} className="w-full py-3 text-slate-400 font-bold text-sm">Cancel</button>
                  </div>
              </div>
          </div>
      )}

      {showBookingModal && selectedInstructor && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm sm:p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl h-[90vh] sm:h-auto overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                      <div><h3 className="text-xl font-black text-slate-900">Request Booking</h3><p className="text-sm text-slate-500">with {selectedInstructor.name}</p></div>
                      <button onClick={() => setShowBookingModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20} className="text-slate-500"/></button>
                  </div>
                  <div className="space-y-5">
                      <div className="flex gap-3 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl">
                          <div className="flex items-center gap-1"><MapPin size={12}/> {bookingResort?.name}</div>
                          <div className="flex items-center gap-1"><Clock size={12}/> {bookingDate?.toLocaleDateString()} {bookingTime}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1"><Users size={12}/> Learners</label>
                              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 text-slate-900 font-bold" value={learnerCount} onChange={(e) => setLearnerCount(Number(e.target.value))}>
                                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Person{n>1?'s':''}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1"><Clock size={12}/> Duration</label>
                              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 text-slate-900 font-bold" value={duration} onChange={(e) => setDuration(e.target.value)}>
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => <option key={h} value={`${h} Hours`}>{h} Hour{h>1?'s':''}</option>)}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1"><BookOpen size={12}/> I want to learn...</label>
                          <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 h-20 resize-none text-sm text-slate-900 font-medium" placeholder="e.g. Carving, Parallel turns, Park basics..." value={content} onChange={(e) => setContent(e.target.value)}/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1"><PenLine size={12}/> Notes (Optional)</label>
                          <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 h-20 resize-none text-sm text-slate-900 font-medium" placeholder="Any medical conditions or specific requests?" value={notes} onChange={(e) => setNotes(e.target.value)}/>
                      </div>
                      <button disabled={!content} onClick={handleSendRequest} className="w-full py-4 bg-cyan-600 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-cyan-200 mt-4">Send Request</button>
                  </div>
              </div>
          </div>
      )}

      {showBookingSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cyan-900/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-4"><CheckCircle size={64} className="text-green-500 animate-bounce" /></div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h2>
                <p className="text-slate-600 mb-6">Request sent to <span className="font-bold">{showBookingSuccess.name}</span>.</p>
                <div className="flex gap-3">
                    <button onClick={() => { setShowBookingSuccess(null); setActiveTab('messages'); }} className="flex-1 py-3 bg-cyan-100 text-cyan-700 font-bold rounded-xl">View Chats</button>
                    <button onClick={() => setShowBookingSuccess(null)} className="flex-1 py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-200">Keep Browsing</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
