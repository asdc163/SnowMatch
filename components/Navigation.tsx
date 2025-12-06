
import React from 'react';
import { UserRole } from '../types';
import { User, MessageSquare, Flame, Heart, Inbox } from 'lucide-react';

interface NavigationProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ role, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 pb-safe pt-2 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 h-20">
      <div className="flex justify-between items-start max-w-md mx-auto">
        
        {role === UserRole.STUDENT && (
          <button 
            onClick={() => onTabChange('match')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'match' ? 'text-cyan-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <Flame size={24} fill={activeTab === 'match' ? "currentColor" : "none"} strokeWidth={activeTab === 'match' ? 2 : 2.5} />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
        )}

        {role === UserRole.INSTRUCTOR && (
          <button 
            onClick={() => onTabChange('requests')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'requests' ? 'text-cyan-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <Inbox size={24} strokeWidth={activeTab === 'requests' ? 2 : 2.5} />
            <span className="text-[10px] font-bold">Requests</span>
          </button>
        )}

        {role === UserRole.STUDENT && (
            <button 
                onClick={() => onTabChange('favorites')}
                className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'favorites' ? 'text-pink-500' : 'text-slate-300 hover:text-slate-400'}`}
            >
                <Heart size={24} fill={activeTab === 'favorites' ? "currentColor" : "none"} strokeWidth={activeTab === 'favorites' ? 2 : 2.5} />
                <span className="text-[10px] font-bold">Saved</span>
            </button>
        )}

        <button 
          onClick={() => onTabChange('messages')}
          className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'messages' ? 'text-cyan-600' : 'text-slate-300 hover:text-slate-400'}`}
        >
          <MessageSquare size={24} strokeWidth={activeTab === 'messages' ? 2 : 2.5} />
          <span className="text-[10px] font-bold">Chats</span>
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'profile' ? 'text-cyan-600' : 'text-slate-300 hover:text-slate-400'}`}
        >
          <User size={24} strokeWidth={activeTab === 'profile' ? 2 : 2.5} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
