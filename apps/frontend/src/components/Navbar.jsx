export default function Navbar({ view, onNavigate, users, currentUserId, onUserChange }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h1>Fynd</h1>
      </div>

      <div className="navbar-tagline-row">
        <p>Add items you don't need. Find items you want. Swap it locally.</p>
      </div>

      <div className="navbar-controls">
        <nav className="nav-tabs">
          <button type="button" className={`nav-tab ${view === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            Browse
          </button>
          <button type="button" className={`nav-tab ${view === 'mine' ? 'active' : ''}`} onClick={() => onNavigate('mine')}>
            My Listings
          </button>
          <button type="button" className={`nav-tab ${view === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
            Profile
          </button>
          <button type="button" className={`nav-tab ${view === 'community' ? 'active' : ''}`} onClick={() => onNavigate('community')}>
            Fynd Free Market
          </button>
        </nav>

        <select
          className="user-select"
          value={currentUserId || ''}
          onChange={(e) => onUserChange(Number(e.target.value))}
          aria-label="Current profile"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
    </header>
  );
}