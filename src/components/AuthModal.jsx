import React, { useState } from 'react';
import { Mail, Phone, Lock, Heart, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithEmail, signupWithEmail, loginWithPhone } = useUser();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMethod === 'email') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both Email ID and Password.');
          setLoading(false);
          return;
        }

        if (authMode === 'signup') {
          await signupWithEmail(email, password);
          setSuccessMsg('Account created successfully! Set up your profile now.');
        } else {
          await loginWithEmail(email, password);
          setSuccessMsg('Welcome back!');
        }
      } else {
        // Phone Number Authentication
        if (!phone.trim() || phone.length < 8) {
          setErrorMsg('Please enter a valid phone number with country code (e.g. +1234567890).');
          setLoading(false);
          return;
        }

        await loginWithPhone(phone);
        setSuccessMsg('Logged in with phone number successfully!');
      }

      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error("Auth Error:", err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-[#16161D] rounded-3xl shadow-2xl border border-cupid-primary/30 overflow-hidden my-8 animate-heart-pop">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {authMode === 'login' ? 'Welcome Back to Cupid' : 'Join Cupid Campus'}
          </h2>
          <p className="text-xs font-semibold text-purple-100 mt-1">
            Connect with single &amp; committed students on campus
          </p>
        </div>

        {/* Auth Method Tabs (Email vs Phone) */}
        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                authMethod === 'email'
                  ? 'bg-cupid-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email ID</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); setErrorMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                authMethod === 'phone'
                  ? 'bg-cupid-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
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

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-3.5">

            {authMethod === 'email' ? (
              <>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                    Email Address
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
              </>
            ) : (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-sm shadow-lg shadow-cupid-primary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : authMode === 'login' ? 'Log In to Cupid' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center pt-2 border-t border-gray-100 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-extrabold text-cupid-primary dark:text-purple-300 hover:underline"
            >
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
