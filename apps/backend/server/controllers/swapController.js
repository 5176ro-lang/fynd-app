import pool from '../db/pool.js';

const VALID_STATUSES = ['proposed', 'accepted', 'declined', 'completed'];

// GET /api/swaps
export async function getAllSwaps(req, res) {
  try {
    const { listing_id, requester_id } = req.query;
    const conditions = [];
    const values = [];

    if (listing_id) {
      values.push(listing_id);
      conditions.push(`swaps.listing_id = $${values.length}`);
    }
    if (requester_id) {
      values.push(requester_id);
      conditions.push(`swaps.requester_id = $${values.length}`);
    }

    let query = `
      SELECT
        swaps.id, swaps.offer_description, swaps.status, swaps.created_at,
        swaps.listing_id, swaps.requester_id, swaps.offered_listing_id,
        listings.title AS listing_title, listings.user_id AS listing_owner_id,
        requester.name AS requester_name,
        offered.title AS offered_listing_title, offered.photo_url AS offered_listing_photo
      FROM swaps
      JOIN listings ON swaps.listing_id = listings.id
      JOIN users AS requester ON swaps.requester_id = requester.id
      LEFT JOIN listings AS offered ON swaps.offered_listing_id = offered.id
    `;
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ' ORDER BY swaps.created_at DESC';

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Swaps retrieved successfully', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve swaps' });
  }
}

// GET /api/swaps/:id
export async function getSwapById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT swaps.*, listings.title AS listing_title, requester.name AS requester_name
      FROM swaps
      JOIN listings ON swaps.listing_id = listings.id
      JOIN users AS requester ON swaps.requester_id = requester.id
      WHERE swaps.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Swap not found' });
    res.status(200).json({ message: 'Swap retrieved successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve swap' });
  }
}

// POST /api/swaps
export async function createSwap(req, res) {
  try {
    const { listing_id, requester_id, offered_listing_id, offer_description } = req.body;

    if (!listing_id || !requester_id) {
      return res.status(400).json({ message: 'listing_id and requester_id are required' });
    }
    if (!offered_listing_id && !offer_description) {
      return res.status(400).json({
        message: 'Select one of your own listings to offer, or include a note (for free listings)',
      });
    }

    const listing = await pool.query('SELECT id FROM listings WHERE id = $1', [listing_id]);
    if (listing.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });

    if (offered_listing_id) {
      const offered = await pool.query(
        'SELECT id, user_id, status FROM listings WHERE id = $1',
        [offered_listing_id]
      );
      if (offered.rows.length === 0) {
        return res.status(404).json({ message: 'The listing you offered was not found' });
      }
      if (offered.rows[0].user_id !== Number(requester_id)) {
        return res.status(400).json({ message: 'You can only offer a listing you own' });
      }
      if (offered.rows[0].status !== 'available') {
        return res.status(400).json({ message: 'That listing is not available to offer' });
      }
    }

    const result = await pool.query(
      `INSERT INTO swaps (listing_id, requester_id, offered_listing_id, offer_description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [listing_id, requester_id, offered_listing_id || null, offer_description || null]
    );

    await pool.query(
      `UPDATE listings SET status = 'pending' WHERE id = $1 AND status = 'available'`,
      [listing_id]
    );
    if (offered_listing_id) {
      await pool.query(
        `UPDATE listings SET status = 'pending' WHERE id = $1 AND status = 'available'`,
        [offered_listing_id]
      );
    }

    res.status(201).json({ message: 'Swap proposed successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to propose swap' });
  }
}

// PUT /api/swaps/:id
export async function updateSwap(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const existing = await pool.query('SELECT * FROM swaps WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Swap not found' });

    const result = await pool.query(`UPDATE swaps SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    const { listing_id, offered_listing_id } = existing.rows[0];

    if (status === 'completed') {
      await pool.query(`UPDATE listings SET status = 'swapped' WHERE id = $1`, [listing_id]);
      if (offered_listing_id) {
        await pool.query(`UPDATE listings SET status = 'swapped' WHERE id = $1`, [offered_listing_id]);
      }
    } else if (status === 'declined') {
      await pool.query(`UPDATE listings SET status = 'available' WHERE id = $1 AND status = 'pending'`, [listing_id]);
      if (offered_listing_id) {
        await pool.query(`UPDATE listings SET status = 'available' WHERE id = $1 AND status = 'pending'`, [offered_listing_id]);
      }
    }

    res.status(200).json({ message: 'Swap updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update swap' });
  }
}

// DELETE /api/swaps/:id
export async function deleteSwap(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM swaps WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Swap not found' });
    res.status(200).json({ message: 'Swap deleted successfully', data: { id: result.rows[0].id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete swap' });
  }
}