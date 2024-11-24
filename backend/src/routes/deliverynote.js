// routes/deliveryNote.js
const express = require('express');
const DeliveryNote = require('../models/deliverynote');
const router = express.Router();

// Get all delivery notes
router.get('/', async (req, res) => {
  try {
    const deliveryNotes = await DeliveryNote.getAll();
    res.json(deliveryNotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new delivery note
router.post('/', async (req, res) => {
  try {
    const deliveryNoteId = await DeliveryNote.create(req.body);
    res.status(201).json({ id: deliveryNoteId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//


// Delete a delivery note
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await DeliveryNote.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Delivery note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Delivery note not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
