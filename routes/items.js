const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all items for an order
router.get('/order/:orderId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE order_id = ?', [req.params.orderId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  const { order_id, description, quantity, unit_price, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO items (order_id, description, quantity, unit_price, status) VALUES (?, ?, ?, ?, ?)',
      [order_id, description, quantity, unit_price, status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  const { description, quantity, unit_price, status } = req.body;
  try {
    await db.query(
      'UPDATE items SET description = ?, quantity = ?, unit_price = ?, status = ? WHERE id = ?',
      [description, quantity, unit_price, status, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;