import { useState } from 'react';
import { US_CITIES } from '../utils/usCities.js';

export default function Navbar({ view, onNavigate, currentUser, onSignInClick, onLogout, locationFilter, onLocationChange }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <header className="navbar">
      <div className="top-banner">
        Next FyndLocal Market: Sunday, July 26th
      </div>

      <div className="navbar-main">
        <div className="navbar-left">
          <div className="navbar-brand">
            <img src="/fyndlocal-icon.png" alt="" className="brand-icon" />
            <h1>FyndLocal</h1>
          </div>
          <p className="navbar-tagline-left">List it. Fynd it. Swap it locally.</p>
        </div>

        <div className="navbar-right">
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
      </div>

      <div className="navbar-tabs-row">
        <nav className="nav-tabs">
          <button type="button" className={`nav-tab ${view === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            Browse
          </button>
          <button type="button" className={`nav-tab ${view === 'mine' ? 'active' : ''}`} onClick={() => onNavigate('mine')}>
            My Listings
          </button>
          <button type="button" className={`nav-tab ${view === 'community' ? 'active' : ''}`} onClick={() => onNavigate('community')}>
            FyndLocal Market
          </button>
        </nav>
        <button type="button" className="how-it-works-link" onClick={() => setShowHowItWorks(true)}>
          How it works
        </button>
      </div>

      {showHowItWorks && (
        <div className="modal-backdrop" onClick={() => setShowHowItWorks(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>How FyndLocal works</h3>
            <ol className="how-it-works-list">
              <li><strong>Post what you don't need.</strong> Add a photo, a quick description, and whether you want a trade or you're giving it away free.</li>
              <li><strong>Browse what others are offering.</strong> Filter by category or city to find things near you.</li>
              <li><strong>Propose a swap.</strong> Offer one of your own listings in trade, or claim a free item outright.</li>
              <li><strong>Meet up safely.</strong> Use a public spot — a library, or our monthly FyndLocal Market — to trade in person.</li>
            </ol>
            <button type="button" className="btn primary" style={{ width: '100%', marginTop: 16 }} onClick={() => setShowHowItWorks(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
}