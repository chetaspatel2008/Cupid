import React, { useState } from 'react';
import { Mail, Lock, Heart, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

// RFC Standard Email Validator
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export default function LoginPage({ onLoginSuccess }) {
  const { loginWithEmail, signupWithEmail } = useUser();
  const { theme, toggleTheme } = useTheme();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Input states
  const [email, setEmail] = useState(() => localStorage.getItem('cupid_last_email') || '');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Direct Login / Signup submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (!isValidEmail(normalizedEmail)) {
        throw new Error('Please enter a valid student email address (e.g. student@college.edu).');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const registered = JSON.parse(localStorage.getItem('cupid_registered_accounts') || '{}');
      const accountExists = Boolean(registered[normalizedEmail]);

      if (authMode === 'login') {
        if (!accountExists) {
          throw new Error(`🚫 No account found for "${normalizedEmail}". Please click "Create an account" below to register first!`);
        }
        if (registered[normalizedEmail]?.password && registered[normalizedEmail].password !== password) {
          throw new Error('❌ Incorrect password. Please try again.');
        }

        await loginWithEmail(normalizedEmail, password);
        setSuccessMsg('✅ Logged in successfully! Welcome back to Cupid...');
      } else {
        if (accountExists) {
          throw new Error(`⚠️ An account with "${normalizedEmail}" is already registered! Please click "Already registered? Log In" below.`);
        }

        await signupWithEmail(normalizedEmail, password);
        setSuccessMsg('✅ Account created! Welcome to Cupid...');
      }

      setLoading(false);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cupid-lightBg dark:bg-cupid-darkBg text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cupid-primary via-cupid-vivid to-cupid-pink flex items-center justify-center shadow-cupid-glow">
            <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink bg-clip-text text-transparent">
            Cupid
          </span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 text-cupid-primary dark:text-purple-300 border border-cupid-primary/20 shadow-sm hover:scale-105 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-cupid-primary" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side: Brand Value & Features */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-xs font-black uppercase text-cupid-primary dark:text-purple-300 border border-cupid-primary/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Campus Dating & Social</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find Your Match on <span className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink bg-clip-text text-transparent">Campus 💘</span>
          </h1>

          <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-purple-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Connect with real campus classmates, live chat in real time, and discover your dating partner or campus study buddy.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#16161D]/70 backdrop-blur-md border border-cupid-primary/20 shadow-sm text-left">
              <span className="text-2xl mb-1 block">🎓</span>
              <h4 className="text-xs font-extrabold">Student Verified</h4>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Campus college accounts tailored for students.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#16161D]/70 backdrop-blur-md border border-cupid-primary/20 shadow-sm text-left">
              <span className="text-2xl mb-1 block">💬</span>
              <h4 className="text-xs font-extrabold">Live Chat</h4>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Real-time instant messaging across campus.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#16161D]/70 backdrop-blur-md border border-cupid-primary/20 shadow-sm text-left">
              <span className="text-2xl mb-1 block">👧 👦</span>
              <h4 className="text-xs font-extrabold">Campus Match</h4>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Find single students filtered by major & year.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login / Signup Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-white dark:bg-[#16161D] rounded-3xl shadow-2xl border border-cupid-primary/30 overflow-hidden animate-heart-pop">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink p-6 text-white text-center">
              <h2 className="text-2xl font-black tracking-tight">
                {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
              </h2>
              <p className="text-xs font-semibold text-purple-100 mt-1">
                {authMode === 'login'
                  ? 'Enter your college email and password'
                  : 'Sign up with your college email to get started'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              
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

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                    Student College Email ID
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
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
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
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-sm shadow-lg shadow-cupid-primary/30 flex items-center justify-center gap-2 hover:opacity-95 transform hover:-translate-y-0.5 transition-all mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : authMode === 'login' ? 'Log In to Cupid' : 'Create Student Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Mode Toggle */}
              <div className="space-y-2 text-center pt-2 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-extrabold text-cupid-primary dark:text-purple-300 hover:underline block w-full"
                >
                  {authMode === 'login' ? "New student? Create an account" : "Already registered? Log In"}
                </button>
              </div>

            </div>

          </div>
        </div>

      </main>

      <footer className="w-full py-4 text-center text-xs font-bold text-gray-500 dark:text-purple-400">
        💘 Cupid Campus Connect • College Student Dating &amp; Connections
      </footer>

    </div>
  );
}
