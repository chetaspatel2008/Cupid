import React, { useState } from 'react';
import { Search, Filter, Heart, Sparkles, UserCheck, Flame, MessageCircle, Users, UserPlus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import UserCard from './UserCard';

export default function DiscoverFeed({ onOpenDetail }) {
  const { profiles = [], currentUser = {}, setIsProfileModalOpen, isFirebaseConfigured, setIsFirebaseSettingsOpen } = useUser();

  // Gender filter tab (Girls, Guys, Everyone)
  const [genderTab, setGenderTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lookingFilter, setLookingFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const validProfiles = Array.isArray(profiles) ? profiles.filter(p => p && typeof p === 'object') : [];

  // Combine profiles with currentUser if currentUser is complete and not already in profiles
  const allDisplayProfiles = React.useMemo(() => {
    const list = [...validProfiles];
    if (currentUser?.name && currentUser?.isProfileComplete) {
      const exists = list.some(p => p && (p.id === currentUser.uid || p.uid === currentUser.uid));
      if (!exists) {
        list.unshift({ id: currentUser.uid, ...currentUser, isSelf: true });
      }
    }
    return list;
  }, [validProfiles, currentUser]);

  const filteredProfiles = allDisplayProfiles.filter((p) => {
    if (!p) return false;
    // Gender Filter
    if (genderTab === 'Female' && p.gender !== 'Female') return false;
    if (genderTab === 'Male' && p.gender !== 'Male') return false;

    // Status Filter (Single vs Committed)
    if (statusFilter === 'Single' && p.relationshipStatus !== 'Single') return false;
    if (statusFilter === 'Committed' && p.relationshipStatus !== 'Committed') return false;

    // Looking For Filter
    if (lookingFilter !== 'All' && !p.lookingFor?.toLowerCase().includes(lookingFilter.toLowerCase())) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchMajor = p.major?.toLowerCase().includes(q);
      const matchBio = p.bio?.toLowerCase().includes(q);
      return Boolean(matchName || matchMajor || matchBio);
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Banner / Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white shadow-xl shadow-cupid-primary/25 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase mb-3 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Campus Dating & Social Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cupid Campus Hub 💘
          </h1>
          <p className="text-sm font-semibold text-purple-100 mt-2 leading-relaxed">
            Real live multi-user chat. Connect with single & committed students on campus!
          </p>
        </div>
        
        {/* Background decorative hearts */}
        <div className="absolute -right-8 -bottom-10 opacity-20 pointer-events-none">
          <Heart className="w-64 h-64 fill-white animate-pulse" />
        </div>
      </div>

      {/* Main Filter & Navigation Controls */}
      <div className="bg-white/80 dark:bg-[#16161D]/80 backdrop-blur-md p-4 rounded-3xl border border-cupid-primary/20 shadow-md space-y-4">
        
        {/* Row 1: Primary Gender Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Gender Filter Options */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
            {[
              { id: 'All', label: '✨ Everyone', count: validProfiles.length },
              { id: 'Female', label: '👧 Girls', count: validProfiles.filter(p => p?.gender === 'Female').length },
              { id: 'Male', label: '👦 Guys', count: validProfiles.filter(p => p?.gender === 'Male').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGenderTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  genderTab === tab.id
                    ? 'bg-cupid-primary text-white shadow-md shadow-cupid-primary/30 scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${genderTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search real students by name or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none"
            />
          </div>

        </div>

        {/* Row 2: Secondary Status & Looking For Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
          
          {/* Single vs Committed Status Filters */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-purple-300">
              Relationship Status:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'All', label: 'All Statuses' },
                { id: 'Single', label: '💚 Single Only' },
                { id: 'Committed', label: '🟣 Committed Only' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st.id
                      ? 'bg-cupid-primary text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Profile Cards Grid Display */}
      {filteredProfiles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#16161D] rounded-3xl border border-cupid-primary/20 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-cupid-primary">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Get Started on Cupid 💘</h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Connect with fellow students on campus! Set up your profile to start discovering matches and live chatting.
            </p>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-cupid-primary hover:bg-cupid-primaryHover text-white font-extrabold text-xs shadow-lg shadow-cupid-primary/30 inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Get Started</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <UserCard
              key={profile.id}
              profile={profile}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}

    </div>
  );
}
