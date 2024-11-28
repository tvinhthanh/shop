const express = require('express');
const connection = require('../config/database'); // Kết nối MySQL
const { check, validationResult } = require('express-validator');
const { upload, uploadToCloudinary } = require('../middleware/upload'); // Sử dụng middleware upload

const router = express.Router();

// Thêm khách sạn mới
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Received request body:', req.body);

  // Kiểm tra lỗi từ express-validator (nếu có)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Lấy thông tin từ body
  const { user_id, name, address, city, country, rating, phone, room } = req.body;
  const imageFile = req.file ? req.file : null;

  if (!imageFile) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload hình ảnh lên Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(imageFile);
    const imageUrl = cloudinaryResponse.secure_url; // Lấy URL hình ảnh từ Cloudinary

    const query =
      'INSERT INTO hotels (user_id, name, address, city, country, rating, phone, room, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Thực hiện query để thêm khách sạn
    connection.query(
      query,
      [
        user_id,
        name,
        address || null,
        city || null,
        country || null,
        rating || null,
        phone,
        room || 0,
        imageUrl, // Lưu URL hình ảnh từ Cloudinary
      ],
      (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ message: 'Error adding hotel', error: err });
        }
        res.status(201).json({ message: 'Hotel added successfully', hotelId: results.insertId });
      }
    );
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error: err });
  }
});

// Lấy tất cả khách sạn
router.get('/', (req, res) => {
  connection.query('SELECT * FROM hotels', (err, hotels) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching hotels', error: err });
    }
    res.status(200).json(hotels);
  });
});

// Lấy khách sạn theo id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM hotels WHERE hotel_id = ?', [id], (err, hotel) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching hotel', error: err });
    }
    if (hotel.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json(hotel[0]);
  });
});

// Cập nhật khách sạn
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, email, phone, description } = req.body;

  const query =
    'UPDATE hotels SET name = ?, location = ?, email = ?, phone = ?, description = ? WHERE id_hotel = ?';

  connection.query(
    query,
    [name, location, email, phone, description, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating hotel', error: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Hotel not found for update' });
      }
      res.status(200).json({ message: 'Hotel updated successfully' });
    }
  );
});

// Xóa khách sạn
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM hotels WHERE id_hotel = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting hotel', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Hotel not found for deletion' });
    }
    res.status(200).json({ message: 'Hotel deleted successfully' });
  });
});

// Lấy khách sạn của người dùng
router.get("/user/:user_id", (req, res) => {
  const { user_id } = req.params;

  connection.promise()
    .query("SELECT * FROM hotels WHERE user_id = ?", [user_id])
    .then(([hotels]) => {
      if (!hotels || hotels.length === 0) {
        return res.status(404).json({ message: `No hotels found for user_id ${user_id}` });
      }
      res.status(200).json(hotels);
    })
    .catch(error => {
      console.error("Error fetching user hotels:", error);
      res.status(500).json({ message: "Error fetching user hotels" });
    });
});

module.exports = router;
