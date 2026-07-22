import { useState } from 'react';
import { uploadPhoto } from '../api/api.js';
import { resolvePhotoUrl } from '../utils/photoUrl.js';

const CATEGORIES = ['Fashion', 'Kitchen', 'Yard & Home', 'Electronics', 'Books', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Fashion',
  listing_type: 'item',
  listing_mode: 'swap',
  duration_days: '7',
  looking_for: '',
  photo_url: '',
  hashtags: '',
  status: 'available',
};

export default function ListingForm({ initialData, onCancel, onSubmit }) {
  const [form, setForm] = useState(() => {
    if (!initialData) return emptyForm;
    return {
      ...emptyForm,
      ...initialData,
      hashtags: (initialData.hashtags || []).join(', '),
    };
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEditing = Boolean(initialData);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadPhoto(file);
      setForm((f) => ({ ...f, photo_url: res.data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.category) {
      setError('Title and category are required.');
      return;
    }

    const hashtagList = form.hashtags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (hashtagList.length > 3) {
      setError('You can add up to 3 hashtags.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ ...form, hashtags: hashtagList });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit listing' : 'Post a new listing'}</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="e.g. Denim jacket, size M"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Condition, size, pickup details…"
            />
          </div>

          <div className="form-field">
            <label htmlFor="photo_file">Photo</label>
            <input
              id="photo_file"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {uploading && <span className="form-hint">Uploading…</span>}
            {form.photo_url && !uploading && (
              <img src={resolvePhotoUrl(form.photo_url)} alt="Preview" style={{ width: 120, borderRadius: 12, marginTop: 6 }} />
            )}
          </div>

          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={handleChange('category')} required>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="listing_type">Type</label>
            <select id="listing_type" value={form.listing_type} onChange={handleChange('listing_type')}>
              <option value="item">Item</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="listing_mode">Swap or give away free?</label>
            <select id="listing_mode" value={form.listing_mode} onChange={handleChange('listing_mode')}>
              <option value="swap">I want something in return (Swap)</option>
              <option value="free">Giving it away, no trade needed (Free)</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="duration_days">Available until</label>
            <select id="duration_days" value={form.duration_days} onChange={handleChange('duration_days')}>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="21">3 weeks</option>
              <option value="30">1 month</option>
            </select>
          </div>

          {form.listing_mode === 'swap' && (
            <div className="form-field">
              <label htmlFor="looking_for">Looking for in return</label>
              <input
                id="looking_for"
                type="text"
                value={form.looking_for}
                onChange={handleChange('looking_for')}
                placeholder="e.g. Kitchenware, or leave blank for open offers"
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="hashtags">Hashtags (up to 3, comma-separated)</label>
            <input
              id="hashtags"
              type="text"
              value={form.hashtags}
              onChange={handleChange('hashtags')}
              placeholder="e.g. vintage, denim, y2k"
            />
          </div>

          {isEditing && (
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={handleChange('status')}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="swapped">Swapped</option>
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Post listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}