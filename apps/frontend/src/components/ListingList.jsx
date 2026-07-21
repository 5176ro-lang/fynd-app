import ListingCard from './ListingCard.jsx';
import LoadingMessage from './LoadingMessage.jsx';
import EmptyState from './EmptyState.jsx';

export default function ListingList({
  listings, loading, error, currentUserId, onEdit, onDelete, onPropose, onOpenListing,
}) {
  if (loading) return <LoadingMessage />;
  if (error) return <EmptyState error message={`Couldn't load listings: ${error}`} />;
  if (listings.length === 0) {
    return <EmptyState message="No listings match your search yet. Try a different filter, or be the first to list something." />;
  }

  return (
    <div className="listing-grid">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onPropose={onPropose}
          onOpenListing={onOpenListing}
        />
      ))}
    </div>
  );
}