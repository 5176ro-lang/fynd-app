import pool from '../db/pool.js';

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    const result = await pool.query(
      'SELECT id, name, username, email, zip_code, neighborhood, bio FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    res.status(200).json({ message: 'Login successful', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
}

// POST /api/auth/signup
export async function signup(req, res) {
  try {
    const { name, username, password, email, zip_code, neighborhood, bio } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({ message: 'name, username, password, and email are required' });
    }

    const result = await pool.query(
      `INSERT INTO users (name, username, password, email, zip_code, neighborhood, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, username, email, zip_code, neighborhood, bio`,
      [name, username, password, email, zip_code || null, neighborhood || null, bio || null]
    );

    res.status(201).json({ message: 'Account created successfully', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'That username or email is already taken' });
    }
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
}