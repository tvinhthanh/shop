// routes/order.js
const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by OrderID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const orderId = await Order.create(req.body);
    res.status(201).json({ id: orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing order
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Order updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
