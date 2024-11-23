// routes/category.js
const express = require('express');
const Category = require('../models/catagory');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const categoryId = await Category.create(req.body);
    res.status(201).json({ id: categoryId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const updated = await Category.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Category updated successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
