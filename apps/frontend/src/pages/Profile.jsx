import { useEffect, useState } from 'react';
import LoadingMessage from '../components/LoadingMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getUserProfile, updateUser, checkUsername } from '../api/api.js';
import { resolvePhotoUrl } from '../utils/photoUrl.js';

export default function Profile({ currentUserId, refreshKey }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', zip_code: '', neighborhood: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUserProfile(currentUserId);
      setProfile(res.data);
      setForm({
        name: res.data.user.name,
        username: res.data.user.username,
        zip_code: res.data.user.zip_code || '',
        neighborhood: res.data.user.neighborhood || '',
        bio: res.data.user.bio || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, refreshKey]);

  const handleUsernameBlur = async () => {
    if (!form.username) return;
    try {
      const res = await checkUsername(form.username, currentUserId);
      setUsernameStatus(res.data);
    } catch {
      setUsernameStatus(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(currentUserId, form);
      setEditing(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingMessage label="Loading profile…" />;
  if (error) return <EmptyState error message={`Couldn't load profile: ${error}`} />;
  if (!profile) return null;

  const { user, listings, swapped_count, total_listings } = profile;
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <section>
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>@{user.username}{user.neighborhood ? ` · ${user.neighborhood}` : ''}{user.zip_code ? ` · ${user.zip_code}` : ''}</p>
          {user.bio && <p>{user.bio}</p>}
          <button type="button" className="btn" style={{ marginTop: 10 }} onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">{swapped_count}</span>
            <span className="stat-label">Swapped</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">{total_listings}</span>
            <span className="stat-label">Listed</span>
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit profile</h3>
            <form onSubmit={handleSave}>
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  value={form.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                    setUsernameStatus(null);
                  }}
                  onBlur={handleUsernameBlur}
                  required
                />
                {usernameStatus && (
                  <p className={`username-status ${usernameStatus.available ? 'available' : 'taken'}`}>
                    {usernameStatus.available ? '✓ Available' : 'Already taken'}
                  </p>
                )}
                {usernameStatus && !usernameStatus.available && usernameStatus.suggestions.length > 0 && (
                  <div className="username-suggestions">
                    {usernameStatus.suggestions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className="username-suggestion-chip"
                        onClick={() => {
                          setForm({ ...form, username: s });
                          setUsernameStatus(null);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="zip_code">Zip code</label>
                <input
                  id="zip_code"
                  value={form.zip_code}
                  onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
                  placeholder="e.g. 43201"
                />
              </div>

              <div className="form-field">
                <label htmlFor="neighborhood">Neighborhood</label>
                <input
                  id="neighborhood"
                  value={form.neighborhood}
                  onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="section-divider">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Listing history</h2>
        <span className="rule"></span>
      </div>

      <p className="form-hint" style={{ marginBottom: 16 }}>
        Want to edit or delete a listing? Head to <strong>My Listings</strong> — edit/delete only show up there, on things you actually own.
      </p>

      {listings.length === 0 ? (
        <EmptyState message="No listings yet." />
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <div className="listing-card" key={listing.id}>
              {listing.photo_url && (
                <img src={resolvePhotoUrl(listing.photo_url)} alt={listing.title} className="listing-photo" />
              )}
              <div className="listing-card-body">
                <h3>{listing.title}</h3>
                {listing.hashtags && listing.hashtags.length > 0 && (
                  <div className="hashtag-row">
                    {listing.hashtags.map((tag) => (
                      <span key={tag} className="hashtag-chip">#{tag}</span>
                    ))}
                  </div>
                )}
                <span className={`status-pill ${listing.status}`}>{listing.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}