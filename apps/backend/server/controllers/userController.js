import pool from '../db/pool.js';

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, username, email, zip_code, neighborhood, bio, created_at FROM users ORDER BY name ASC'
    );
    res.status(200).json({ message: 'Users retrieved successfully', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, username, email, zip_code, neighborhood, bio, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User retrieved successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
}

// GET /api/users/:id/profile
export async function getUserProfile(req, res) {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      'SELECT id, name, username, email, zip_code, neighborhood, bio, created_at FROM users WHERE id = $1',
      [id]
    );
    if (userResult.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const listingsResult = await pool.query(
      `SELECT id, title, description, category, listing_type, listing_mode, photo_url, hashtags, status, expires_at, created_at
       FROM listings WHERE user_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    const countResult = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'swapped') AS swapped_count,
         COUNT(*) AS total_listings
       FROM listings WHERE user_id = $1`,
      [id]
    );

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: {
        user: userResult.rows[0],
        listings: listingsResult.rows,
        swapped_count: Number(countResult.rows[0].swapped_count),
        total_listings: Number(countResult.rows[0].total_listings),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, username, zip_code, neighborhood, bio } = req.body;

    if (!name || !username) {
      return res.status(400).json({ message: 'name and username are required' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await pool.query(
      `UPDATE users SET name = $1, username = $2, zip_code = $3, neighborhood = $4, bio = $5
       WHERE id = $6 RETURNING id, name, username, email, zip_code, neighborhood, bio, created_at`,
      [name, username, zip_code || null, neighborhood || null, bio || null, id]
    );

    res.status(200).json({ message: 'Profile updated successfully', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'That username is already taken' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}

// GET /api/users/check-username?username=&exclude_id=
// Returns availability, and a few suggestions if taken.
export async function checkUsername(req, res) {
  try {
    const { username, exclude_id } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'username is required' });
    }

    const params = exclude_id ? [username, exclude_id] : [username];
    const query = exclude_id
      ? 'SELECT id FROM users WHERE username = $1 AND id != $2'
      : 'SELECT id FROM users WHERE username = $1';

    const result = await pool.query(query, params);
    const available = result.rows.length === 0;

    let suggestions = [];
    if (!available) {
      const candidates = [
        `${username}${Math.floor(Math.random() * 90 + 10)}`,
        `${username}_swap`,
        `the_${username}`,
      ];
      const check = await pool.query(
        'SELECT username FROM users WHERE username = ANY($1)',
        [candidates]
      );
      const taken = new Set(check.rows.map((r) => r.username));
      suggestions = candidates.filter((c) => !taken.has(c));
    }

    res.status(200).json({
      message: available ? 'Username is available' : 'Username is taken',
      data: { available, suggestions },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to check username' });
  }
}