const express = require('express');
const connection = require('../config/database'); // Kết nối MySQL
const { upload, uploadToCloudinary } = require('../middleware/upload'); // Sử dụng middleware upload

const router = express.Router();

// Thêm cửa hàng mới
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Received request body:', req.body);

  const { store_name, user_id, address } = req.body;
  const imageFile = req.file ? req.file : null;

  if (!store_name || !user_id || !address) {
    return res.status(400).json({ message: 'store_name, user_id, and address are required.' });
  }

  if (!imageFile) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload hình ảnh lên Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(imageFile);
    const imageUrl = cloudinaryResponse.secure_url; // Lấy URL hình ảnh từ Cloudinary

    const query =
      'INSERT INTO stores (store_name, user_id, address, image) VALUES (?, ?, ?, ?)';

    // Thực hiện query để thêm cửa hàng
    connection.query(
      query,
      [store_name, user_id, address, imageUrl],
      (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ message: 'Error adding store', error: err });
        }
        res.status(201).json({ message: 'Store added successfully', storeId: results.insertId });
      }
    );
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error: err });
  }
});

// Lấy tất cả cửa hàng
router.get('/', (req, res) => {
  connection.query('SELECT * FROM stores', (err, stores) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching stores', error: err });
    }
    res.status(200).json(stores);
  });
});

// Lấy cửa hàng theo id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM stores WHERE store_id = ?', [id], (err, store) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching store', error: err });
    }
    if (store.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store[0]);
  });
});

// Cập nhật cửa hàng
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { store_name, user_id, address } = req.body;

  const query =
    'UPDATE stores SET store_name = ?, user_id = ?, address = ? WHERE store_id = ?';

  connection.query(
    query,
    [store_name, user_id, address, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating store', error: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Store not found for update' });
      }
      res.status(200).json({ message: 'Store updated successfully' });
    }
  );
});

// Xóa cửa hàng
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM stores WHERE store_id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting store', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found for deletion' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  });
});

// Lấy cửa hàng của một người dùng
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  connection.promise()
    .query('SELECT * FROM stores WHERE user_id = ?', [user_id])
    .then(([stores]) => {
      if (!stores || stores.length === 0) {
        return res.status(404).json({ message: `No stores found for user_id ${user_id}` });
      }
      res.status(200).json(stores);
    })
    .catch((error) => {
      console.error('Error fetching user stores:', error);
      res.status(500).json({ message: 'Error fetching user stores' });
    });
});

module.exports = router;
