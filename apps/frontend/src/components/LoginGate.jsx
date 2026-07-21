export default function LoginGate({ users, onLogin }) {
  return (
    <div className="login-gate">
      <div className="login-gate-brand">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h1>Fynd</h1>
        <p>Add items you don't need. Find items you want. Swap it locally.</p>
      </div>

      <div className="login-gate-card">
        <h2>Choose your account to continue</h2>
        <div className="login-user-grid">
          {users.map((user) => (
            <button
              type="button"
              key={user.id}
              className="login-user-card"
              onClick={() => onLogin(user.id)}
            >
              <span className="login-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="login-user-name">{user.name}</span>
              <span className="login-user-meta">@{user.username}{user.neighborhood ? ` · ${user.neighborhood}` : ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}