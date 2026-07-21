import pool from '../db/pool.js';

const VALID_TYPES = ['item', 'service'];
const VALID_MODES = ['swap', 'free'];
const VALID_STATUSES = ['available', 'pending', 'swapped'];

// GET /api/listings
export async function getAllListings(req, res) {
  try {
    const { category, listing_type, listing_mode, search, status, sort, hashtag } = req.query;
    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`listings.category = $${values.length}`);
    }
    if (listing_type) {
      values.push(listing_type);
      conditions.push(`listings.listing_type = $${values.length}`);
    }
    if (listing_mode) {
      values.push(listing_mode);
      conditions.push(`listings.listing_mode = $${values.length}`);
    }
    if (status) {
      values.push(status);
      conditions.push(`listings.status = $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`listings.title ILIKE $${values.length}`);
    }
    if (hashtag) {
      values.push(hashtag);
      conditions.push(`$${values.length} = ANY(listings.hashtags)`);
    }

    let query = `
      SELECT
        listings.id, listings.title, listings.description, listings.category,
        listings.listing_type, listings.listing_mode, listings.looking_for,
        listings.photo_url, listings.hashtags, listings.status,
        listings.expires_at, listings.created_at, listings.user_id,
        users.name AS owner_name, users.username AS owner_username,
        users.city AS owner_city, users.neighborhood AS owner_neighborhood,
        users.zip_code AS owner_zip_code,
        CASE
          WHEN listings.listing_mode = 'swap'
               AND listings.expires_at IS NOT NULL
               AND listings.expires_at < NOW()
               AND listings.status = 'available'
          THEN 'free'
          ELSE listings.listing_mode
        END AS effective_mode
      FROM listings
      JOIN users ON listings.user_id = users.id
    `;
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;

    const sortOptions = {
      newest: 'listings.created_at DESC',
      oldest: 'listings.created_at ASC',
      title: 'listings.title ASC',
    };
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.newest}`;

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Listings retrieved successfully', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve listings' });
  }
}

// GET /api/listings/:id
export async function getListingById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT
        listings.*,
        users.name AS owner_name, users.username AS owner_username,
        users.city AS owner_city, users.neighborhood AS owner_neighborhood,
        users.zip_code AS owner_zip_code, users.email AS owner_email,
        CASE
          WHEN listings.listing_mode = 'swap'
               AND listings.expires_at IS NOT NULL
               AND listings.expires_at < NOW()
               AND listings.status = 'available'
          THEN 'free'
          ELSE listings.listing_mode
        END AS effective_mode
      FROM listings
      JOIN users ON listings.user_id = users.id
      WHERE listings.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json({ message: 'Listing retrieved successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve listing' });
  }
}

// GET /api/listings/mine/:userId
export async function getMyAvailableListings(req, res) {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT id, title, photo_url, category FROM listings
       WHERE user_id = $1 AND status = 'available' ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ message: 'Listings retrieved successfully', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve listings' });
  }
}

// POST /api/listings
export async function createListing(req, res) {
  try {
    const {
      user_id, title, description, category, listing_type, listing_mode,
      looking_for, photo_url, hashtags, duration_days,
    } = req.body;

    if (!user_id || !title || !category) {
      return res.status(400).json({ message: 'user_id, title, and category are required' });
    }
    if (listing_type && !VALID_TYPES.includes(listing_type)) {
      return res.status(400).json({ message: `listing_type must be one of: ${VALID_TYPES.join(', ')}` });
    }
    if (listing_mode && !VALID_MODES.includes(listing_mode)) {
      return res.status(400).json({ message: `listing_mode must be one of: ${VALID_MODES.join(', ')}` });
    }
    if (hashtags && hashtags.length > 3) {
      return res.status(400).json({ message: 'You can add up to 3 hashtags' });
    }

    const days = Number(duration_days) || 7;

    const result = await pool.query(
      `INSERT INTO listings (user_id, title, description, category, listing_type, listing_mode, looking_for, photo_url, hashtags, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + ($10 || ' days')::INTERVAL)
       RETURNING *`,
      [
        user_id, title, description || null, category, listing_type || 'item',
        listing_mode || 'swap', looking_for || null, photo_url || null,
        hashtags && hashtags.length ? hashtags : [], days,
      ]
    );

    res.status(201).json({ message: 'Listing created successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create listing' });
  }
}

// PUT /api/listings/:id
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const {
      title, description, category, listing_type, listing_mode,
      looking_for, photo_url, hashtags, status, duration_days,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'title and category are required' });
    }
    if (listing_type && !VALID_TYPES.includes(listing_type)) {
      return res.status(400).json({ message: `listing_type must be one of: ${VALID_TYPES.join(', ')}` });
    }
    if (listing_mode && !VALID_MODES.includes(listing_mode)) {
      return res.status(400).json({ message: `listing_mode must be one of: ${VALID_MODES.join(', ')}` });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    if (hashtags && hashtags.length > 3) {
      return res.status(400).json({ message: 'You can add up to 3 hashtags' });
    }

    const existing = await pool.query('SELECT id FROM listings WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });

    const expiresClause = duration_days
      ? `NOW() + '${Number(duration_days)} days'::INTERVAL`
      : 'expires_at';

    const result = await pool.query(
      `UPDATE listings
       SET title = $1, description = $2, category = $3, listing_type = $4,
           listing_mode = $5, looking_for = $6, photo_url = $7, hashtags = $8,
           status = COALESCE($9, status), expires_at = ${expiresClause}
       WHERE id = $10 RETURNING *`,
      [
        title, description || null, category, listing_type || 'item', listing_mode || 'swap',
        looking_for || null, photo_url || null, hashtags && hashtags.length ? hashtags : [], status, id,
      ]
    );

    res.status(200).json({ message: 'Listing updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update listing' });
  }
}

// DELETE /api/listings/:id
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json({ message: 'Listing deleted successfully', data: { id: result.rows[0].id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
}