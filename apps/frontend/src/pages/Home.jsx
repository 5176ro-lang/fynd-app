import { useEffect, useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar.jsx';
import ListingList from '../components/ListingList.jsx';
import SwapModal from '../components/SwapModal.jsx';
import { getListings, createSwap } from '../api/api.js';

export default function Home({ currentUser, refreshKey, onSwapProposed, locationFilter, onOpenListing, requireLogin }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', listing_type: '', sort: 'newest' });
  const [proposingFor, setProposingFor] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getListings(filters);
        const term = locationFilter.trim().toLowerCase();
        const filtered = term
          ? res.data.filter((l) =>
              (l.owner_city || '').toLowerCase().includes(term) ||
              (l.owner_neighborhood || '').toLowerCase().includes(term) ||
              (l.owner_zip_code || '').toLowerCase().includes(term)
            )
          : res.data;
        if (!ignore) setListings(filtered);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [filters, refreshKey, locationFilter]);

  const handlePropose = async ({ offered_listing_id, offer_description }) => {
    await createSwap({
      listing_id: proposingFor.id,
      requester_id: currentUser.id,
      offered_listing_id,
      offer_description,
    });
    setProposingFor(null);
    setNotice('Sent! Check "My Listings" to follow up.');
    onSwapProposed();
  };

  const handlePropseClick = (listing) => {
    if (!requireLogin()) return;
    setProposingFor(listing);
  };

  return (
    <section>
      <div className="section-divider">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Browse the loop</h2>
        <span className="rule"></span>
      </div>

      <SearchFilterBar filters={filters} onChange={setFilters} />

      {notice && (
        <p className="state-message" style={{ marginBottom: 16 }}>
          {notice}
        </p>
      )}

      <ListingList
        listings={listings}
        loading={loading}
        error={error}
        currentUserId={currentUser?.id}
        onEdit={() => {}}
        onDelete={() => {}}
        onPropose={handlePropseClick}
        onOpenListing={onOpenListing}
      />

      {proposingFor && currentUser && (
        <SwapModal
          listing={proposingFor}
          currentUserId={currentUser.id}
          onCancel={() => setProposingFor(null)}
          onSubmit={handlePropose}
        />
      )}
    </section>
  );
}