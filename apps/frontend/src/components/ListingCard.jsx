import { getCategoryColor } from '../utils/categoryColors.js';

function isNew(createdAt) {
  const created = new Date(createdAt);
  const hoursSince = (Date.now() - created.getTime()) / (1000 * 60 * 60);
  return hoursSince < 48;
}

export default function ListingCard({ listing, currentUserId, onEdit, onDelete, onPropose }) {
  const isOwner = listing.user_id === currentUserId;
  const color = getCategoryColor(listing.category);

  return (
    <div className="listing-card">
      <div className="listing-photo-wrap">
        {listing.photo_url && (
          <img src={listing.photo_url} alt={listing.title} className="listing-photo" />
        )}
        {isNew(listing.created_at) && <span className="new-badge">🔥 New</span>}
        <span className="listing-type-corner">{listing.listing_type}</span>
      </div>

      <div className="listing-card-body">
        <span className="category-chip" style={{ background: color.bg, color: color.text }}>
          {listing.category}
        </span>

        <h3>{listing.title}</h3>

        {listing.description && <p className="description">{listing.description}</p>}

        <p className="meta-row">
          {listing.owner_name}
          {listing.owner_neighborhood ? ` · ${listing.owner_neighborhood}` : ''}
        </p>

        {listing.hashtags && listing.hashtags.length > 0 && (
          <div className="hashtag-row">
            {listing.hashtags.map((tag) => (
              <span key={tag} className="hashtag-chip">#{tag}</span>
            ))}
          </div>
        )}

        {listing.looking_for && (
          <p className="looking-for">
            <strong>Looking for:</strong> {listing.looking_for}
          </p>
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
              Propose a swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}