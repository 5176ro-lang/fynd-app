import { useState } from 'react';
import { login, signup } from '../api/api.js';

export default function LoginModal({ onClose, onLoggedIn }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({
    username: '', password: '', name: '', email: '', zip_code: '', neighborhood: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(form.username, form.password);
        onLoggedIn(res.data);
      } else {
        const res = await signup(form);
        onLoggedIn(res.data);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-brand">
          <span className="loop-glyph" aria-hidden="true"></span>
          <h1>Fynd</h1>
        </div>

        <div className="login-modal-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          {mode === 'signup' && (
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={handleChange('name')} required />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" value={form.username} onChange={handleChange('username')} required />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={handleChange('password')} required />
          </div>

          {mode === 'signup' && (
            <>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={handleChange('email')} required />
              </div>
              <div className="form-field">
                <label htmlFor="neighborhood">Neighborhood</label>
                <input id="neighborhood" value={form.neighborhood} onChange={handleChange('neighborhood')} placeholder="e.g. Short North" />
              </div>
              <div className="form-field">
                <label htmlFor="zip_code">Zip code</label>
                <input id="zip_code" value={form.zip_code} onChange={handleChange('zip_code')} placeholder="e.g. 43201" />
              </div>
            </>
          )}

          <div className="modal-actions" style={{ justifyContent: 'stretch' }}>
            <button type="submit" className="btn primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="login-modal-hint">
          Demo account: username <strong>user1</strong>, password <strong>123</strong>
        </p>

        <button type="button" className="login-modal-close" onClick={onClose}>Continue browsing</button>
      </div>
    </div>
  );
}