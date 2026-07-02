const express = require('express');
const router = express.Router();
const db = require('../db');

// Register endpoint
router.post('/register', async (req, res, next) => {
  const { username, password, fullName, phone } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  try {
    const query = 'INSERT INTO users (username, password, full_name, phone) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name';
    const result = await db.query(query, [username, password, fullName, phone]);

    res.status(201).json({
      success: true,
      data: {
        user: result.rows[0],
        token: 'fake-jwt-token-' + result.rows[0].id // Placeholder for real JWT
      }
    });
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    next(error);
  }
});

// Login endpoint
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await db.query(query, [username, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    delete user.password; // Don't send password back

    res.status(200).json({
      success: true,
      data: {
        user,
        token: 'fake-jwt-token-' + user.id // Placeholder for real JWT
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
