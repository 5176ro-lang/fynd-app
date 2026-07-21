import { useEffect, useState } from 'react';
import LoadingMessage from '../components/LoadingMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SwapModal from '../components/SwapModal.jsx';
import { getListing, createSwap } from '../api/api.js';
import { getCategoryColor } from '../utils/categoryColors.js';
import { resolvePhotoUrl } from '../utils/photoUrl.js';

export default function ListingDetail({ listingId, currentUser, onBack, onSwapProposed, requireLogin }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposing, setProposing] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getListing(listingId);
        if (!ignore) setListing(res.data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [listingId]);

  const handlePropose = async ({ offered_listing_id, offer_description }) => {
    await createSwap({
      listing_id: listing.id,
      requester_id: currentUser.id,
      offered_listing_id,
      offer_description,
    });
    setProposing(false);
    setNotice('Sent! Check "My Listings" to follow up.');
    onSwapProposed();
  };

  const handleProposeClick = () => {
    if (!requireLogin()) return;
    setProposing(true);
  };

  if (loading) return <LoadingMessage label="Loading listing…" />;
  if (error) return <EmptyState error message={`Couldn't load listing: ${error}`} />;
  if (!listing) return null;

  const mode = listing.effective_mode || listing.listing_mode;
  const color = getCategoryColor(listing.category);
  const isOwner = currentUser && listing.user_id === currentUser.id;

  return (
    <section>
      <button type="button" className="btn" style={{ marginBottom: 20 }} onClick={onBack}>
        ← Back to browse
      </button>

      <div className="listing-detail">
        {listing.photo_url && (
          <img src={resolvePhotoUrl(listing.photo_url)} alt={listing.title} className="listing-detail-photo" />
        )}

        <div className="listing-detail-body">
          <span className="category-chip" style={{ background: color.bg, color: color.text }}>{listing.category}</span>
          <span className={`mode-badge ${mode}`} style={{ marginLeft: 8 }}>{mode === 'free' ? 'Free' : 'Swap'}</span>

          <h1>{listing.title}</h1>

          <p className="meta-row" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
            Posted by {listing.owner_username ? `@${listing.owner_username}` : listing.owner_name}
            {listing.owner_neighborhood ? ` · ${listing.owner_neighborhood}` : ''}
          </p>

          {listing.description && <p className="description" style={{ fontSize: '1rem' }}>{listing.description}</p>}

          {listing.hashtags && listing.hashtags.length > 0 && (
            <div className="hashtag-row" style={{ margin: '12px 0' }}>
              {listing.hashtags.map((tag) => <span key={tag} className="hashtag-chip">#{tag}</span>)}
            </div>
          )}

          {mode === 'swap' && listing.looking_for && (
            <p className="looking-for" style={{ paddingLeft: 0, borderTop: 'none' }}>
              <strong>Looking for:</strong> {listing.looking_for}
            </p>
          )}

          <span className={`status-pill ${listing.status}`} style={{ marginTop: 10 }}>{listing.status}</span>

          {notice && <p className="state-message" style={{ marginTop: 16 }}>{notice}</p>}

          {!isOwner && (
            <button
              type="button"
              className="btn accent"
              style={{ marginTop: 20, width: '100%' }}
              disabled={listing.status !== 'available'}
              onClick={handleProposeClick}
            >
              {mode === 'free' ? 'Claim this' : 'Propose a swap'}
            </button>
          )}
        </div>
      </div>

      {proposing && currentUser && (
        <SwapModal
          listing={listing}
          currentUserId={currentUser.id}
          onCancel={() => setProposing(false)}
          onSubmit={handlePropose}
        />
      )}
    </section>
  );
}