import { useState } from 'react';
import { US_CITIES } from '../utils/usCities.js';

export default function Navbar({ view, onNavigate, currentUser, onSignInClick, onLogout, locationFilter, onLocationChange }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-brand-centered">
        <div className="navbar-brand">
          <span className="loop-glyph" aria-hidden="true"></span>
          <h1>Fynd</h1>
        </div>
        <p className="navbar-tagline-centered">Add items you don't need. Find items you want. Swap it locally.</p>
      </div>

      <div className="navbar-top-right">
        <input
          className="location-pill"
          list="us-cities-list"
          type="text"
          placeholder="City, e.g. Columbus, OH"
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
          aria-label="Filter by city"
        />
        <datalist id="us-cities-list">
          {US_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        {currentUser ? (
          <div className="profile-pill-wrap">
            <button type="button" className="profile-pill" onClick={() => setShowProfileMenu((s) => !s)}>
              <span className="profile-pill-avatar">{currentUser.name.charAt(0).toUpperCase()}</span>
              <span>{currentUser.name}</span>
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('profile');
                  }}
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="btn primary" onClick={onSignInClick}>
            Sign In
          </button>
        )}
      </div>

      <div className="navbar-controls-row">
        <nav className="nav-tabs">
          <button type="button" className={`nav-tab ${view === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            Browse
          </button>
          <button type="button" className={`nav-tab ${view === 'mine' ? 'active' : ''}`} onClick={() => onNavigate('mine')}>
            My Listings
          </button>
          <button type="button" className={`nav-tab ${view === 'community' ? 'active' : ''}`} onClick={() => onNavigate('community')}>
            Fynd Free Market
          </button>
        </nav>
      </div>
    </header>
  );
}