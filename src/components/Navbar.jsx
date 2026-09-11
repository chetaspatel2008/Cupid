import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { chats, setActiveChatUser } = useUser();

  const chatValues = Array.isArray(chats) ? chats : Object.values(chats || {});
  const totalUnread = chatValues.reduce((acc, chat) => {
    if (Array.isArray(chat)) return acc;
    return acc + (chat?.unreadCount || 0);
  }, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#16161D]/80 backdrop-blur-xl border-b border-cupid-primary/20 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Cupid Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cupid-primary via-cupid-vivid to-cupid-pink flex items-center justify-center shadow-cupid-glow group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink bg-clip-text text-transparent">
              Cupid
            </span>
          </div>
        </div>

        {/* Right Corner: Live Chat Icon Only (No Text) */}
        <button
          onClick={() => setActiveTab('chat')}
          aria-label="Live Chat"
          title="Live Real-Time Chat"
          className={`relative p-2.5 rounded-2xl transition-all ${
            activeTab === 'chat'
              ? 'bg-cupid-primary text-white shadow-lg shadow-cupid-primary/30 scale-105'
              : 'bg-cupid-primary/10 hover:bg-cupid-primary/20 text-cupid-primary dark:text-purple-300 border border-cupid-primary/20'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cupid-pink text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
              {totalUnread}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}
