import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import DiscoverFeed from './components/DiscoverFeed';
import ChatDrawer from './components/ChatDrawer';
import CampusWall from './components/CampusWall';
import MatchQuiz from './components/MatchQuiz';
import ProfileModal from './components/ProfileModal';
import UserDetailModal from './components/UserDetailModal';
import FirebaseSettingsModal from './components/FirebaseSettingsModal';
import AuthModal from './components/AuthModal';
import EmailLoginPage from './components/EmailLoginPage';
import LoginPage from './components/LoginPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Cupid App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cupid-lightBg dark:bg-cupid-darkBg flex items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-[#16161D] p-8 rounded-3xl shadow-2xl border border-cupid-primary/30 max-w-lg space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">💘 Cupid App Notice</h2>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              An unexpected issue occurred while rendering components:
            </p>
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-left text-xs font-mono text-red-600 dark:text-red-400 overflow-x-auto max-h-40">
              {this.state.error?.toString() || 'Unknown rendering error'}
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="px-6 py-3 rounded-2xl bg-cupid-primary hover:bg-cupid-primaryHover text-white font-extrabold text-xs shadow-md transition-all"
            >
              Reset App Data & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CupidMainApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedProfileDetail, setSelectedProfileDetail] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { activeChatUser, setActiveChatUser, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-cupid-lightBg dark:bg-cupid-darkBg text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20">
      
      {/* Top Header Navigation (Logo on Left, Live Chat Icon ONLY on Right) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-6">
        {activeTab === 'feed' && (
          <DiscoverFeed onOpenDetail={(profile) => setSelectedProfileDetail(profile)} />
        )}
        {activeTab === 'login' && (
          <EmailLoginPage onAuthSuccess={() => setActiveTab('feed')} />
        )}
        {activeTab === 'chat' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <ChatDrawer isOpen={true} onClose={() => setActiveTab('feed')} />
          </div>
        )}
        {activeTab === 'wall' && <CampusWall />}
        {activeTab === 'quiz' && <MatchQuiz />}
      </main>

      {/* Slide-over Chat Drawer */}
      {activeTab !== 'chat' && activeChatUser && (
        <ChatDrawer isOpen={true} onClose={() => setActiveChatUser(null)} />
      )}

      {/* Mandatory Profile Setup Modal (Includes Dark/Light Theme Option) */}
      <ProfileModal onSaveSuccess={() => setActiveTab('feed')} />

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Firebase Config Modal */}
      <FirebaseSettingsModal />

      {/* Student Profile Detail Modal */}
      {selectedProfileDetail && (
        <UserDetailModal
          profile={selectedProfileDetail}
          onClose={() => setSelectedProfileDetail(null)}
        />
      )}

      {/* Fixed Bottom Navigation (Discover Singles, Campus Wall, Match Test, Profile Page) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

function RootApp() {
  const [showLoginPage, setShowLoginPage] = useState(() => {
    const hasLoggedIn = localStorage.getItem('cupid_has_logged_in');
    return hasLoggedIn !== 'true';
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('cupid_has_logged_in', 'true');
    setShowLoginPage(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cupid_has_logged_in');
    setShowLoginPage(true);
  };

  if (showLoginPage) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <CupidMainApp onLogout={handleLogout} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <RootApp />
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
