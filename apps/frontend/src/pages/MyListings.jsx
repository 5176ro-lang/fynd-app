import { useEffect, useState } from 'react';
import ListingList from '../components/ListingList.jsx';
import ListingForm from '../components/ListingForm.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  getListings, createListing, updateListing, deleteListing, getSwaps, updateSwap,
} from '../api/api.js';

export default function MyListings({ currentUserId, refreshKey, onChanged }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [swapsLoading, setSwapsLoading] = useState(true);

  const loadListings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getListings();
      setListings(res.data.filter((l) => l.user_id === currentUserId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSwaps = async () => {
    setSwapsLoading(true);
    try {
      const [sentRes, allListingsRes] = await Promise.all([
        getSwaps({ requester_id: currentUserId }),
        getListings(),
      ]);
      setSent(sentRes.data);

      const myListingIds = allListingsRes.data
        .filter((l) => l.user_id === currentUserId)
        .map((l) => l.id);

      const receivedResults = await Promise.all(myListingIds.map((id) => getSwaps({ listing_id: id })));
      setReceived(receivedResults.flatMap((r) => r.data));
    } catch (err) {
      console.error(err);
    } finally {
      setSwapsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    loadSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, refreshKey]);

  const handleSave = async (form) => {
    if (editing && editing.id) {
      await updateListing(editing.id, form);
    } else {
      await createListing({ ...form, user_id: currentUserId });
    }
    setEditing(null);
    loadListings();
    onChanged();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    await deleteListing(id);
    loadListings();
    onChanged();
  };

  const handleSwapStatus = async (swapId, status) => {
    await updateSwap(swapId, { status });
    loadSwaps();
    loadListings();
    onChanged();
  };

  return (
    <section>
      <div className="section-divider">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>My listings</h2>
        <span className="rule"></span>
        <button type="button" className="btn primary" onClick={() => setEditing({})}>+ New listing</button>
      </div>

      <ListingList
        listings={listings}
        loading={loading}
        error={error}
        currentUserId={currentUserId}
        onEdit={(listing) => setEditing(listing)}
        onDelete={handleDelete}
        onPropose={() => {}}
      />

      <div className="section-divider" style={{ marginTop: 40 }}>
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Swap requests on my listings</h2>
        <span className="rule"></span>
      </div>

      {swapsLoading ? (
        <LoadingMessage label="Loading swap requests…" />
      ) : received.length === 0 ? (
        <EmptyState message="No one has proposed a swap yet." />
      ) : (
        <div className="swap-list">
          {received.map((swap) => (
            <div className="swap-item" key={swap.id}>
              <div className="swap-text">
                <strong>{swap.requester_name}</strong> offers: {swap.offer_description}
                <br />
                for <strong>{swap.listing_title}</strong> · status: {swap.status}
              </div>
              {swap.status === 'proposed' && (
                <div className="swap-actions">
                  <button className="btn primary" onClick={() => handleSwapStatus(swap.id, 'accepted')}>Accept</button>
                  <button className="btn danger" onClick={() => handleSwapStatus(swap.id, 'declined')}>Decline</button>
                </div>
              )}
              {swap.status === 'accepted' && (
                <div className="swap-actions">
                  <button className="btn accent" onClick={() => handleSwapStatus(swap.id, 'completed')}>Mark completed</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="section-divider" style={{ marginTop: 40 }}>
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Swaps I've proposed</h2>
        <span className="rule"></span>
      </div>

      {swapsLoading ? (
        <LoadingMessage label="Loading your proposals…" />
      ) : sent.length === 0 ? (
        <EmptyState message="You haven't proposed any swaps yet — browse listings to get started." />
      ) : (
        <div className="swap-list">
          {sent.map((swap) => (
            <div className="swap-item" key={swap.id}>
              <div className="swap-text">
                You offered: {swap.offer_description}
                <br />
                for <strong>{swap.listing_title}</strong> · status: {swap.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ListingForm initialData={editing.id ? editing : null} onCancel={() => setEditing(null)} onSubmit={handleSave} />
      )}
    </section>
  );
}