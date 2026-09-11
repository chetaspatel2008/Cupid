import React, { useState } from 'react';
import { Mail, Lock, Heart, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function EmailLoginPage({ onAuthSuccess }) {
  const { loginWithEmail, signupWithEmail, currentUser, firebaseUser, logoutUser } = useUser();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email Address and Password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signupWithEmail(email, password);
        setSuccessMsg('Account created successfully! Let\'s set up your profile now.');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg('Logged in successfully!');
      }

      setLoading(false);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess();
      }, 800);
    } catch (err) {
      console.error("Firebase Email Auth error:", err);
      let friendlyError = err.message || 'Authentication failed.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This Email ID is already registered. Try logging in!';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid email or password. Please try again.';
      }
      setErrorMsg(friendlyError);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#16161D] rounded-3xl shadow-2xl border border-cupid-primary/30 overflow-hidden animate-heart-pop">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink p-8 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
            <Heart className="w-9 h-9 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Campus Student Login' : 'Create Student Account'}
          </h2>
          <p className="text-xs font-semibold text-purple-100 mt-1">
            Sign in with your Email ID to save live chats &amp; profile on Cloud Firestore
          </p>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-5">
          
          {/* Active Logged-in Info if logged in */}
          {firebaseUser?.email && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
              <span>Logged in as: <strong>{firebaseUser.email}</strong></span>
              <button
                type="button"
                onClick={logoutUser}
                className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-black"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                mode === 'login'
                  ? 'bg-cupid-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                mode === 'signup'
                  ? 'bg-cupid-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                Student Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-sm shadow-lg shadow-cupid-primary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Log In to Cupid' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
