import React from 'react';
import { Compass, Flame, Sparkles, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { setIsProfileModalOpen } = useUser();

  const navItems = [
    { id: 'feed', label: 'Discover Singles', icon: Compass },
    { id: 'wall', label: 'Campus Wall', icon: Flame },
    { id: 'quiz', label: 'Match Test', icon: Sparkles },
    { id: 'profile', label: 'Profile Page', icon: User },
  ];

  const handleTabClick = (id) => {
    if (id === 'profile') {
      setIsProfileModalOpen(true);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#16161D]/90 backdrop-blur-xl border-t border-cupid-primary/20 shadow-2xl py-2 px-4 transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-cupid-primary scale-110'
                  : 'text-gray-500 dark:text-gray-400 hover:text-cupid-primary dark:hover:text-purple-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-cupid-primary/15 text-cupid-primary' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-extrabold tracking-tight ${isActive ? 'text-cupid-primary font-black' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
