import React, { useState } from 'react';
import { X, Database, Check, ShieldCheck, ExternalLink, RefreshCw, Key, AlertCircle, PlusCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getFirebaseConfig } from '../firebase';

export default function FirebaseSettingsModal() {
  const { isFirebaseSettingsOpen, setIsFirebaseSettingsOpen, isFirebaseConfigured, saveFirebaseCredentials } = useUser();
  
  const currentConfig = getFirebaseConfig();

  const [formData, setFormData] = useState({
    apiKey: currentConfig.apiKey && !currentConfig.apiKey.includes('Placeholder') ? currentConfig.apiKey : '',
    authDomain: currentConfig.authDomain || 'cupid-3874c.firebaseapp.com',
    projectId: currentConfig.projectId || 'cupid-3874c',
    storageBucket: currentConfig.storageBucket || 'cupid-3874c.firebasestorage.app',
    messagingSenderId: currentConfig.messagingSenderId || '337770116871',
    appId: currentConfig.appId || '1:337770116871:web:cupid3874c'
  });

  const [notice, setNotice] = useState('');

  if (!isFirebaseSettingsOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let keyToUse = formData.apiKey.trim();

    // Smart parser if user pasted entire firebaseConfig code snippet from Add Firebase SDK screen
    if (keyToUse.includes('apiKey:')) {
      const match = keyToUse.match(/apiKey:\s*["']([^"']+)["']/);
      if (match && match[1]) keyToUse = match[1];
    } else if (keyToUse.includes('"apiKey":')) {
      const match = keyToUse.match(/"apiKey":\s*["']([^"']+)["']/);
      if (match && match[1]) keyToUse = match[1];
    }

    if (!keyToUse || keyToUse.includes('Placeholder')) {
      setNotice('Please paste your Web API Key (starts with AIzaSy...) from your Firebase Console.');
      return;
    }
    saveFirebaseCredentials({ ...formData, apiKey: keyToUse });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#16161D] rounded-3xl shadow-2xl border border-cupid-primary/30 overflow-hidden my-8 animate-heart-pop">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink p-6 text-white text-center relative">
          <button
            onClick={() => setIsFirebaseSettingsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Connect to Project: cupid-3874c</h2>
          <p className="text-xs font-semibold text-purple-100 mt-1">
            Project Number: <code className="px-1.5 py-0.5 rounded bg-white/20 font-mono">337770116871</code>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-[#0B0B0E] border border-cupid-primary/30 text-xs font-medium text-gray-700 dark:text-gray-300 space-y-2">
            <div className="flex items-center gap-2 text-cupid-primary font-bold">
              <PlusCircle className="w-4 h-4 text-cupid-primary" />
              <span>If "Your apps" is empty in your Firebase Console:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
              <li>Go to your <a href="https://console.firebase.google.com/project/cupid-3874c/overview" target="_blank" rel="noreferrer" className="text-cupid-primary font-extrabold underline inline-flex items-center gap-0.5">Firebase Console Overview <ExternalLink className="w-3 h-3" /></a>.</li>
              <li>Click the web icon <strong className="px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 font-mono text-purple-900 dark:text-purple-100">&lt;/&gt;</strong> right under your project name at the top center.</li>
              <li>Type app nickname <code className="font-mono bg-purple-100 dark:bg-purple-950 px-1 py-0.5 rounded">Cupid Web</code> &amp; click <strong>Register App</strong>.</li>
              <li>Copy the generated <code className="font-mono bg-purple-100 dark:bg-purple-950 px-1 py-0.5 rounded">apiKey: "AIzaSy..."</code> &amp; paste it below!</li>
            </ol>
          </div>

          {notice && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1 flex items-center justify-between">
              <span>Firebase Web API Key (apiKey) <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-cupid-primary font-bold">Starts with AIzaSy...</span>
            </label>
            <input
              type="text"
              required
              placeholder="Paste AIzaSy... here"
              value={formData.apiKey}
              onChange={(e) => { setFormData({ ...formData, apiKey: e.target.value }); setNotice(''); }}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-cupid-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                Project ID
              </label>
              <input
                type="text"
                disabled
                value={formData.projectId}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-300 mb-1">
                Sender ID / Project Number
              </label>
              <input
                type="text"
                disabled
                value={formData.messagingSenderId}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-sm shadow-lg shadow-cupid-primary/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all mt-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Save &amp; Connect Live Database (cupid-3874c)</span>
          </button>
        </form>

      </div>
    </div>
  );
}
