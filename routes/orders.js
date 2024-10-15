// Add this to the existing orders.js file

// Get orders with pagination
router.get('/paginated', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query('SELECT * FROM orders LIMIT ? OFFSET ?', [limit, offset]);
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM orders');
    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders: rows,
      currentPage: page,
      totalPages: totalPages,
      totalOrders: totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders with filter
router.get('/filtered', async (req, res) => {
  const { status } = req.query;
  
  try {
    let query = 'SELECT * FROM orders';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});