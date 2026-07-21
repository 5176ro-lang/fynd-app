import { getCategoryColor } from '../utils/categoryColors.js';
import { resolvePhotoUrl } from '../utils/photoUrl.js';

function isNew(createdAt) {
  const hoursSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursSince < 48;
}

export default function ListingCard({ listing, currentUserId, onEdit, onDelete, onPropose, onOpenListing }) {
  const isOwner = listing.user_id === currentUserId;
  const color = getCategoryColor(listing.category);
  const mode = listing.effective_mode || listing.listing_mode;

  return (
    <div className="listing-card">
      <div
        className="listing-photo-wrap"
        style={{ cursor: onOpenListing ? 'pointer' : 'default' }}
        onClick={() => onOpenListing && onOpenListing(listing.id)}
      >
        {listing.photo_url && (
          <img src={resolvePhotoUrl(listing.photo_url)} alt={listing.title} className="listing-photo" />
        )}
        {isNew(listing.created_at) && <span className="new-badge">NEW</span>}
        <span className="listing-type-corner">{listing.listing_type}</span>
      </div>

      <div className="listing-card-body">
        <span className="category-chip" style={{ background: color.bg, color: color.text }}>{listing.category}</span>
        <span className={`mode-badge ${mode}`}>{mode === 'free' ? 'Free' : 'Swap'}</span>

        <h3 style={{ cursor: onOpenListing ? 'pointer' : 'default' }} onClick={() => onOpenListing && onOpenListing(listing.id)}>
          {listing.title}
        </h3>

        {listing.description && <p className="description">{listing.description}</p>}

        <p className="meta-row">
          {listing.owner_username ? `@${listing.owner_username}` : listing.owner_name}
          {listing.owner_neighborhood ? ` · ${listing.owner_neighborhood}` : ''}
        </p>

        {listing.hashtags && listing.hashtags.length > 0 && (
          <div className="hashtag-row">
            {listing.hashtags.map((tag) => <span key={tag} className="hashtag-chip">#{tag}</span>)}
          </div>
        )}

        {mode === 'swap' && listing.looking_for && (
          <p className="looking-for"><strong>Looking for:</strong> {listing.looking_for}</p>
        )}

        <span className={`status-pill ${listing.status}`}>{listing.status}</span>

        <div className="card-actions">
          {isOwner ? (
            <>
              <button type="button" className="btn" onClick={() => onEdit(listing)}>Edit</button>
              <button type="button" className="btn danger" onClick={() => onDelete(listing.id)}>Delete</button>
            </>
          ) : (
            <button
              type="button"
              className="btn accent"
              disabled={listing.status !== 'available'}
              onClick={() => onPropose(listing)}
            >
              {mode === 'free' ? 'Claim this' : 'Propose a swap'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}