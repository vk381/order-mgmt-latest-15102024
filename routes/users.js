// Update the existing users.js file

const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, role, phone_number FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { username, password, role, phone_number } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (username, password, role, phone_number) VALUES (?, ?, ?, ?)',
      [username, password, role, phone_number]
    );
    res.status(201).json({ id: result.insertId, username, role, phone_number });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { username, role, phone_number } = req.body;
  try {
    await db.query(
      'UPDATE users SET username = ?, role = ?, phone_number = ? WHERE id = ?',
      [username, role, phone_number, req.params.id]
    );
    res.json({ id: req.params.id, username, role, phone_number });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;