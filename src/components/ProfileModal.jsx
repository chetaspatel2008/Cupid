import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldCheck, AlertCircle, Camera, Upload, Trash2, Sun, Moon, LogOut, Mail, UserCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

function calculateAge(dobString) {
  if (!dobString) return '';
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : '';
}

export default function ProfileModal({ onSaveSuccess }) {
  const { currentUser, updateProfile, isProfileModalOpen, setIsProfileModalOpen, firebaseUser, logoutUser, deleteUserAccount } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    dob: currentUser.dob || '2004-01-15',
    age: currentUser.age || calculateAge(currentUser.dob) || 20,
    gender: currentUser.gender || 'Male',
    relationshipStatus: currentUser.relationshipStatus || 'Single',
    lookingFor: currentUser.lookingFor || 'Girlfriend',
    major: currentUser.major || 'Computer Science',
    year: currentUser.year || 'Junior',
    bio: currentUser.bio || 'College student exploring connections on Cupid!',
    instagram: currentUser.instagram || '@student_life',
    photoUrl: currentUser.photoUrl || ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Always sync formData when modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
      setFormData({
        name: currentUser.name || '',
        dob: currentUser.dob || '2004-01-15',
        age: currentUser.age || calculateAge(currentUser.dob) || 20,
        gender: currentUser.gender || 'Male',
        relationshipStatus: currentUser.relationshipStatus || 'Single',
        lookingFor: currentUser.lookingFor || 'Girlfriend',
        major: currentUser.major || 'Computer Science',
        year: currentUser.year || 'Junior',
        bio: currentUser.bio || 'College student exploring connections on Cupid!',
        instagram: currentUser.instagram || '@student_life',
        photoUrl: currentUser.photoUrl || ''
      });
      setErrorMsg('');
      setShowDeleteConfirm(false);
    }
  }, [isProfileModalOpen, currentUser]);

  if (!isProfileModalOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    const computedAge = calculateAge(selectedDob);
    setFormData(prev => ({
      ...prev,
      dob: selectedDob,
      age: computedAge || prev.age || 20
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMsg('Name is mandatory! Please enter your name.');
      return;
    }

    const effectiveDob = formData.dob || '2004-01-15';
    const computedAge = calculateAge(effectiveDob) || formData.age || 20;

    if (computedAge < 16) {
      setErrorMsg('You must be at least 16 years old to join Cupid campus!');
      return;
    }

    const dataToSave = {
      ...formData,
      dob: effectiveDob,
      age: computedAge
    };

    setErrorMsg('');
    await updateProfile(dataToSave);
    setIsProfileModalOpen(false);

    if (onSaveSuccess) {
      onSaveSuccess();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const maxDateLimit = new Date(Date.now() - 16 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#16161D] rounded-3xl shadow-2xl border border-cupid-primary/30 overflow-hidden my-8 animate-heart-pop">
        
          {/* Header Banner */}
        <div className="bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink p-6 text-white text-center relative">
          
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create Your Cupid Campus Profile</h2>
          <p className="text-xs font-medium text-purple-100 mt-1">
            Mandatory: Name, Birth Date (Calendar), Gender & Relationship Status!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Profile Photo Uploader Section */}
          <div className="flex flex-col items-center justify-center pb-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-2">
              Upload Profile Photo
            </label>
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cupid-primary shadow-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-3xl font-black text-cupid-primary">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{formData.name ? formData.name.charAt(0).toUpperCase() : '📷'}</span>
                )}
              </div>

              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-cupid-primary text-white shadow-md cursor-pointer hover:scale-110 transition-all">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {formData.photoUrl && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                className="mt-2 text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3 h-3" /> Remove Photo
              </button>
            )}
          </div>

          {/* Mandatory Section 1: Name & Calendar Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5 flex items-center justify-between">
                <span>Full Name <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-cupid-primary dark:text-purple-400 font-semibold">Mandatory</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5 flex items-center justify-between">
                <span>Date of Birth 📅 <span className="text-red-500">*</span></span>
                {formData.age ? (
                  <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Age: {formData.age} yrs
                  </span>
                ) : (
                  <span className="text-[10px] text-cupid-primary dark:text-purple-400 font-semibold">Mandatory</span>
                )}
              </label>
              <input
                type="date"
                required
                max={maxDateLimit}
                value={formData.dob}
                onChange={handleDobChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Mandatory Section 2 & 3: Gender & Relationship Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
                {['Male', 'Female', 'Non-Binary'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      formData.gender === g
                        ? 'bg-cupid-primary text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {g === 'Male' ? '👦 Male' : g === 'Female' ? '👧 Female' : '✨ Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Status Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5">
                Relationship Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
                {['Single', 'Committed'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, relationshipStatus: status })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      formData.relationshipStatus === status
                        ? status === 'Single'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-cupid-primary text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {status === 'Single' ? '💚 Single' : '🟣 Committed'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Looking For Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5">
              Looking For
            </label>
            <select
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-cupid-primary focus:outline-none transition-all"
            >
              <option value="Girlfriend">Looking for a Girlfriend 💕</option>
              <option value="Boyfriend">Looking for a Boyfriend 💖</option>
              <option value="Dating & Vibes">Casual Dating & Vibes 🥂</option>
              <option value="Study Partner">Study Partner & Coffee Dates 📚</option>
              <option value="Friends & Hangouts">Campus Friends & Group Hangouts 🎉</option>
            </select>
          </div>

          {/* Major & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5">
                College Major
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-cupid-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-cupid-primary focus:outline-none transition-all"
              >
                <option value="Freshman">Freshman (1st Year)</option>
                <option value="Sophomore">Sophomore (2nd Year)</option>
                <option value="Junior">Junior (3rd Year)</option>
                <option value="Senior">Senior (4th Year)</option>
                <option value="Grad Student">Grad Student</option>
              </select>
            </div>
          </div>

          {/* App Theme Preference Option */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-purple-200 mb-1.5 flex items-center justify-between">
              <span>App Theme Preference 🎨</span>
              <span className="text-[10px] text-cupid-primary dark:text-purple-400 font-semibold">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-[#0B0B0E] border border-gray-200 dark:border-purple-900/40">
              <button
                type="button"
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-cupid-primary text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-cupid-primary text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-300" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Account & Session Management (Log Out & Delete ID options) */}
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-[#0B0B0E] border border-cupid-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cupid-primary" />
                <span className="text-xs font-extrabold text-gray-900 dark:text-white">Account & Data Management</span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                {firebaseUser?.email ? firebaseUser.email : 'Campus Account Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                }}
                className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ID</span>
              </button>
            </div>

            {/* Confirmation Box for Delete ID */}
            {showDeleteConfirm && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2.5 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Are you sure you want to permanently delete your Cupid ID? This will remove your profile, photos, and match data from the server.
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={async () => {
                      setIsDeleting(true);
                      await deleteUserAccount();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete ID Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cupid-primary via-cupid-vivid to-cupid-pink text-white font-extrabold text-base tracking-wide shadow-lg shadow-cupid-primary/40 hover:opacity-95 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Save Profile</span>
          </button>
        </form>

      </div>
    </div>
  );
}
