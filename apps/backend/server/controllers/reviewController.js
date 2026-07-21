import pool from '../db/pool.js';

// GET /api/reviews?reviewee_id=&swap_id=
export async function getAllReviews(req, res) {
  try {
    const { reviewee_id, swap_id } = req.query;
    const conditions = [];
    const values = [];

    if (reviewee_id) {
      values.push(reviewee_id);
      conditions.push(`reviews.reviewee_id = $${values.length}`);
    }
    if (swap_id) {
      values.push(swap_id);
      conditions.push(`reviews.swap_id = $${values.length}`);
    }

    let query = `
      SELECT
        reviews.id, reviews.rating, reviews.comment, reviews.created_at,
        reviews.swap_id, reviews.reviewee_id,
        reviewer.name AS reviewer_name
      FROM reviews
      JOIN users AS reviewer ON reviews.reviewer_id = reviewer.id
    `;
    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ' ORDER BY reviews.created_at DESC';

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Reviews retrieved successfully', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve reviews' });
  }
}

// POST /api/reviews
export async function createReview(req, res) {
  try {
    const { swap_id, reviewer_id, reviewee_id, rating, comment } = req.body;

    if (!swap_id || !reviewer_id || !reviewee_id || !rating) {
      return res.status(400).json({
        message: 'swap_id, reviewer_id, reviewee_id, and rating are required',
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const swap = await pool.query('SELECT id, status FROM swaps WHERE id = $1', [swap_id]);
    if (swap.rows.length === 0) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    if (swap.rows[0].status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed swaps' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (swap_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [swap_id, reviewer_id, reviewee_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Review submitted successfully', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      // unique_violation — duplicate (swap_id, reviewer_id)
      return res.status(400).json({ message: 'You already reviewed this swap' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
}

// GET /api/users/:id/rating  (average rating summary)
export async function getUserRating(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         users.id,
         users.name,
         ROUND(AVG(reviews.rating), 1) AS average_rating,
         COUNT(reviews.id) AS review_count
       FROM users
       LEFT JOIN reviews ON reviews.reviewee_id = users.id
       WHERE users.id = $1
       GROUP BY users.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const row = result.rows[0];
    res.status(200).json({
      message: 'Rating retrieved successfully',
      data: {
        user_id: row.id,
        name: row.name,
        average_rating: row.average_rating ? Number(row.average_rating) : null,
        review_count: Number(row.review_count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve rating' });
  }
}