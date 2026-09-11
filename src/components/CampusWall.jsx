import React, { useState } from 'react';
import { Flame, Heart, Send, MessageSquare, Sparkles, Filter, Coffee, Users, Search } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function CampusWall() {
  const { wallPosts, addWallPost, likeWallPost, currentUser } = useUser();
  const [newPostText, setNewPostText] = useState('');
  const [category, setCategory] = useState('Crush');
  const [filterCategory, setFilterCategory] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    addWallPost(newPostText, category);
    setNewPostText('');
  };

  const filteredPosts = filterCategory === 'All' 
    ? wallPosts 
    : wallPosts.filter(p => p.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white shadow-xl shadow-cupid-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase mb-2">
            <Flame className="w-4 h-4 text-orange-300" />
            <span>Campus Confessions & Date Invites</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">The Cupid Campus Wall</h1>
          <p className="text-xs font-semibold text-purple-100 mt-1 max-w-xl">
            Post anonymous thoughts, look for coffee dates, or find partners for campus projects!
          </p>
        </div>
        <div className="absolute right-4 bottom-0 opacity-15 pointer-events-none">
          <Heart className="w-48 h-48 fill-white" />
        </div>
      </div>

      {/* Post Creator Box */}
      <div className="bg-white dark:bg-[#16161D] rounded-3xl p-5 border border-cupid-primary/20 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cupid-primary" />
          <span>Post to Campus Wall</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            placeholder="Share a campus crush, coffee date request, or study group note..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-500 dark:text-purple-300">Category:</span>
              <div className="flex gap-1.5">
                {['Crush', 'Coffee Date', 'Project Partner'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      category === cat
                        ? 'bg-cupid-primary text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'Crush' ? '💘 Crush' : cat === 'Coffee Date' ? '☕️ Coffee' : '🤝 Partner'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-cupid-primary hover:bg-cupid-primaryHover text-white font-extrabold text-xs shadow-md shadow-cupid-primary/30 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post to Wall</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white/60 dark:bg-[#16161D]/60 p-2 rounded-2xl border border-cupid-primary/20 backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Crush', 'Coffee Date', 'Project Partner'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-cupid-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? '🔥 All Posts' : cat === 'Crush' ? '💘 Crushes' : cat === 'Coffee Date' ? '☕️ Coffee Invites' : '🤝 Projects'}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#16161D] border border-cupid-primary/20 shadow-md hover:shadow-lg transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-purple-100 dark:bg-purple-950/50">
                  {post.avatar}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{post.author}</h4>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{post.time}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-cupid-primary dark:text-purple-300 text-[10px] font-extrabold uppercase">
                {post.category}
              </span>
            </div>

            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-relaxed pl-1">
              "{post.content}"
            </p>

            <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => likeWallPost(post.id)}
                className="flex items-center gap-1.5 text-rose-500 font-bold hover:scale-105 transition-all"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{post.likes} Hearts</span>
              </button>
              <span className="text-[10px] font-bold text-cupid-primary dark:text-purple-300">
                💬 Reply in Chat
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
