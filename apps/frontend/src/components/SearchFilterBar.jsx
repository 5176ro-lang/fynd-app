import { getCategoryColor, ALL_CATEGORIES } from '../utils/categoryColors.js';

export default function SearchFilterBar({ filters, onChange }) {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  const selectCategory = (cat) => {
    onChange({ ...filters, category: filters.category === cat ? '' : cat });
  };

  return (
    <div>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search listings…"
          value={filters.search}
          onChange={handle('search')}
          aria-label="Search listings by title"
        />

        <select value={filters.listing_type} onChange={handle('listing_type')} aria-label="Filter by type">
          <option value="">Items & services</option>
          <option value="item">Items only</option>
          <option value="service">Services only</option>
        </select>

        <select value={filters.sort} onChange={handle('sort')} aria-label="Sort listings">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      <div className="category-pills">
        {ALL_CATEGORIES.map((cat) => {
          const color = getCategoryColor(cat);
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${active ? '' : 'inactive'}`}
              style={active ? { background: color.bg, color: color.text, borderColor: color.text } : undefined}
              onClick={() => selectCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}