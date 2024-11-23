// routes/cart.js
const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();
const connection = require('../config/db');
// Get all cart items for a customer
router.get('/:customerId', async (req, res) => {
  try {
    const cartItems = await Cart.getByCustomerId(req.params.customerId);
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an item to the cart
router.post('/', async (req, res) => {
  try {
    const cartId = await Cart.addItem(req.body);
    res.status(201).json({ id: cartId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const updated = await Cart.updateItem(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Cart item updated successfully' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete cart item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Cart.removeItem(req.params.id);
    if (deleted) {
      res.json({ message: 'Cart item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const [existingProduct] = await connection.promise().query(
      'SELECT * FROM Cart WHERE UserID = ? AND ProductID = ?',
      [userId, productId]
    );

    if (existingProduct.length > 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      const newQuantity = existingProduct[0].Quantity + quantity;
      await connection.promise().query(
        'UPDATE Cart SET Quantity = ? WHERE CartID = ?',
        [newQuantity, existingProduct[0].CartID]
      );
      return res.status(200).json({ message: 'Product quantity updated in cart' });
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      await connection.promise().query(
        'INSERT INTO Cart (UserID, ProductID, Quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      return res.status(201).json({ message: 'Product added to cart' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error adding product to cart: ' + err.message });
  }
});


module.exports = router;
