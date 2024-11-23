// routes/product.js
const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ProductID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.getById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const productId = await Product.create(req.body);
    res.status(201).json({ id: productId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
