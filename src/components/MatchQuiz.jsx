import React, { useState } from 'react';
import { Sparkles, Heart, MessageCircle, RefreshCw, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';

export default function MatchQuiz() {
  const { profiles = [], setActiveChatUser, currentUser = {} } = useUser();
  const validProfiles = Array.isArray(profiles) ? profiles.filter(p => p && typeof p === 'object') : [];
  const [selectedTargetId, setSelectedTargetId] = useState(validProfiles[0]?.id || '');
  const [q1, setQ1] = useState('Fest');
  const [q2, setQ2] = useState('Coffee');
  const [q3, setQ3] = useState('Texting');
  const [result, setResult] = useState(null);

  const targetProfile = validProfiles.find(p => p.id === selectedTargetId) || validProfiles[0] || null;

  const calculateCompatibility = (e) => {
    e.preventDefault();
    if (!targetProfile) return;

    // Fun algorithmic calculation base
    let score = 75;
    if (q1 === 'Fest' || q1 === 'Sunset') score += 10;
    if (q2 === 'Coffee' || q2 === 'Boba') score += 9;
    if (q3 === 'Texting' || q3 === 'Meetups') score += 5;
    if (targetProfile?.relationshipStatus === 'Single') score += 3;

    score = Math.min(score, 99);
    const targetName = targetProfile?.name ? targetProfile.name.split(' ')[0] : 'Your Match';

    setResult({
      score,
      verdict: score > 90 ? '🔥 Soulmate Compatibility!' : '💖 High Potential Match!',
      summary: `You and ${targetName} share a ${score}% campus vibe alignment based on your lifestyle choices & coffee preferences.`
    });

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white text-center shadow-xl shadow-cupid-primary/20">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Cupid Compatibility Test</h1>
        <p className="text-xs font-semibold text-purple-100 mt-1">
          Pick any student on campus & test your vibe match percentage!
        </p>
      </div>

      {/* Quiz Card */}
      {!targetProfile ? (
        <div className="bg-white dark:bg-[#16161D] rounded-3xl p-8 border border-cupid-primary/20 shadow-md text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-cupid-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">No Campus Students Yet</h3>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Once other students join or register their campus profiles, you can pick anyone to test your mutual compatibility score!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16161D] rounded-3xl p-6 border border-cupid-primary/20 shadow-md space-y-5">
          
          {/* Step 1: Select Student */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-2">
              Select College Student to Test
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {validProfiles.slice(0, 4).map((person) => (
                <div
                  key={person.id}
                  onClick={() => { setSelectedTargetId(person.id); setResult(null); }}
                  className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                    (selectedTargetId === person.id || (!selectedTargetId && targetProfile?.id === person.id))
                      ? 'border-cupid-primary bg-purple-50 dark:bg-purple-950/40 shadow-md'
                      : 'border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cupid-primary/20 flex items-center justify-center text-cupid-primary font-black text-sm mb-1">
                    {person.name ? person.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="text-xs font-bold truncate max-w-full text-gray-900 dark:text-white">{person.name ? person.name.split(' ')[0] : 'Student'}</span>
                  <span className="text-[9px] font-semibold text-cupid-primary dark:text-purple-400">{person.relationshipStatus || 'Single'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Questions Form */}
          <form onSubmit={calculateCompatibility} className="space-y-4 pt-2">
            
            {/* Question 1 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-800 dark:text-gray-200 mb-1.5">
                1. Ideal Weekend Campus Vibe?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Fest', label: '🎉 Music Fest & Campus Party' },
                  { id: 'Sunset', label: '🌅 Sunset & Boba Tea Run' },
                  { id: 'Library', label: '📚 Quiet Library Study' },
                  { id: 'Gaming', label: '🎮 Late Night Gaming & Ramen' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQ1(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                      q1 === opt.id
                        ? 'bg-cupid-primary text-white shadow-md'
                        : 'bg-gray-100 dark:bg-[#0B0B0E] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-800 dark:text-gray-200 mb-1.5">
                2. Favorite Campus Drink?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Coffee', label: '☕️ Filter Coffee & Samosa' },
                  { id: 'Boba', label: '🧋 Taro Boba Milk Tea' },
                  { id: 'Americano', label: '🧊 Iced Americano' },
                  { id: 'Chai', label: '☕ Cutting Chai' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQ2(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                      q2 === opt.id
                        ? 'bg-cupid-primary text-white shadow-md'
                        : 'bg-gray-100 dark:bg-[#0B0B0E] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-800 dark:text-gray-200 mb-1.5">
                3. Communication Preference?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Texting', label: '💬 Texting memes & reels' },
                  { id: 'Meetups', label: '☕️ Coffee meetups in person' },
                  { id: 'Calls', label: '📞 Long late night calls' },
                  { id: 'Quiet', label: '🎧 Quiet study companion' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQ3(opt.id)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                      q3 === opt.id
                        ? 'bg-cupid-primary text-white shadow-md'
                        : 'bg-gray-100 dark:bg-[#0B0B0E] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-sm shadow-lg shadow-cupid-primary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Calculate Compatibility with {targetProfile?.name ? targetProfile.name.split(' ')[0] : 'Match'}</span>
            </button>
          </form>

          {/* Result Card */}
          {result && (
            <div className="p-6 rounded-3xl bg-purple-50 dark:bg-[#0B0B0E] border border-cupid-primary/40 space-y-4 animate-heart-pop text-center">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cupid-primary text-white text-xs font-black">
                <Award className="w-4 h-4 text-yellow-300" />
                <span>{result.verdict}</span>
              </div>

              <div className="text-5xl font-black bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink bg-clip-text text-transparent">
                {result.score}% Match!
              </div>

              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                {result.summary}
              </p>

              <button
                onClick={() => targetProfile?.id && setActiveChatUser(targetProfile.id)}
                className="px-6 py-3 rounded-2xl bg-cupid-primary hover:bg-cupid-primaryHover text-white font-extrabold text-xs shadow-md shadow-cupid-primary/30 inline-flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Chatting with {targetProfile?.name ? targetProfile.name.split(' ')[0] : 'Match'}</span>
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
