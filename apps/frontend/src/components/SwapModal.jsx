import { useEffect, useState } from 'react';
import { getMyAvailableListings } from '../api/api.js';

export default function SwapModal({ listing, currentUserId, onCancel, onSubmit }) {
  const mode = listing.effective_mode || listing.listing_mode;
  const [myListings, setMyListings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === 'swap');

  useEffect(() => {
    if (mode !== 'swap') return;
    getMyAvailableListings(currentUserId)
      .then((res) => setMyListings(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUserId, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'swap' && !selectedId) {
      setError('Select one of your own listings to offer.');
      return;
    }
    if (mode === 'free' && !note.trim()) {
      setError('Add a short note so they know who is picking it up.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        offered_listing_id: mode === 'swap' ? selectedId : null,
        offer_description: mode === 'free' ? note : null,
      });
    } catch (err) {
      setError(err.message || 'Could not send that proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'free' ? `Claim "${listing.title}"` : `Propose a swap for "${listing.title}"`}</h3>

        {mode === 'swap' && listing.looking_for && (
          <p className="looking-for" style={{ paddingLeft: 0, borderTop: 'none', marginBottom: 16 }}>
            <strong>They're hoping for:</strong> {listing.looking_for}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          {mode === 'swap' ? (
            <div className="form-field">
              <label>Pick one of your listings to offer</label>
              {loading ? (
                <p className="form-hint">Loading your listings…</p>
              ) : myListings.length === 0 ? (
                <p className="form-hint">You don't have any available listings yet — post one first from "My Listings."</p>
              ) : (
                <div className="swap-picker">
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className={`swap-picker-item ${selectedId === item.id ? 'selected' : ''}`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      {item.photo_url && <img src={item.photo_url} alt={item.title} />}
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="note">Note for the poster</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. I'd love this — can pick up this weekend!"
                required
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn accent" disabled={submitting}>
              {submitting ? 'Sending…' : mode === 'free' ? 'Claim it' : 'Send proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}