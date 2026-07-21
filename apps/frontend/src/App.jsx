import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import LoginModal from './components/LoginModal.jsx';
import Home from './pages/Home.jsx';
import MyListings from './pages/MyListings.jsx';
import Profile from './pages/Profile.jsx';
import Community from './pages/Community.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import LoadingMessage from './components/LoadingMessage.jsx';

export default function App() {
  const [view, setView] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fynd_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 200);
    return () => clearTimeout(t);
  }, []);

  const bump = () => setRefreshKey((k) => k + 1);

  const requireLogin = () => {
    if (!currentUser) {
      setShowLogin(true);
      return false;
    }
    return true;
  };

  const openListing = (id) => {
    setSelectedListingId(id);
    setView('listing');
  };

  const handleLoggedIn = (user) => {
    setCurrentUser(user);
    localStorage.setItem('fynd_current_user', JSON.stringify(user));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fynd_current_user');
    setView('home');
  };

  if (booting) {
    return (
      <div className="app-shell">
        <LoadingMessage label="Loading Fynd…" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        view={view}
        onNavigate={(v) => {
          if ((v === 'mine' || v === 'profile') && !requireLogin()) return;
          setView(v);
        }}
        currentUser={currentUser}
        onSignInClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
      />

      {view === 'home' && (
        <Home
          currentUser={currentUser}
          refreshKey={refreshKey}
          onSwapProposed={bump}
          locationFilter={locationFilter}
          onOpenListing={openListing}
          requireLogin={requireLogin}
        />
      )}
      {view === 'listing' && (
        <ListingDetail
          listingId={selectedListingId}
          currentUser={currentUser}
          onBack={() => setView('home')}
          onSwapProposed={bump}
          requireLogin={requireLogin}
        />
      )}
      {view === 'mine' && currentUser && (
        <MyListings currentUserId={currentUser.id} refreshKey={refreshKey} onChanged={bump} />
      )}
      {view === 'profile' && currentUser && (
        <Profile currentUserId={currentUser.id} refreshKey={refreshKey} />
      )}
      {view === 'community' && <Community />}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoggedIn={handleLoggedIn}
        />
      )}
    </div>
  );
}