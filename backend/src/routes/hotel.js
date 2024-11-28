const express = require('express');
const { upload, uploadToCloudinary } = require('../middleware/upload'); // Import từ middleware
const connection = require('../config/database');
const router = express.Router();

// API để xử lý upload hình ảnh lên Cloudinary và lưu thông tin vào cơ sở dữ liệu
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Received request body:', req.body);
  console.log('Received file:', req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload file lên Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);

    const { user_id, name, address, city, country, rating, phone, room } = req.body;
    const imageUrl = cloudinaryResult.secure_url;  // Lấy URL của ảnh đã upload

    // Cấu trúc query SQL để lưu thông tin khách sạn vào cơ sở dữ liệu
    const query =
      'INSERT INTO hotels (user_id, name, address, city, country, rating, phone, room, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Thực thi query và bao gồm tất cả các tham số
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
        imageUrl // Lưu URL của ảnh từ Cloudinary
      ],
      (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ message: 'Error adding hotel', error: err });
        }

        // Nếu thành công, trả về ID của khách sạn đã thêm
        res.status(201).json({ message: 'Hotel added successfully', hotelId: results.insertId });
      }
    );
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error });
  }
});

// Lấy tất cả khách sạn
router.get('/', (req, res) => {
  connection.query('SELECT * FROM hotels', (err, hotels) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi lấy khách sạn', error: err });
    }
    res.status(200).json(hotels);
  });
});

// Lấy khách sạn theo id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM hotels WHERE hotel_id = ?', [id], (err, hotel) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi lấy khách sạn', error: err });
    }
    if (hotel.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    }
    res.status(200).json(hotel[0]);
  });
});

// Cập nhật khách sạn
router.put('/:hotel_id', upload.single('image'), async (req, res) => {
  const hotelId = req.params.hotel_id;
  const { user_id, name, address, city, country, rating, phone, room } = req.body;
  
  console.log('Received request body:', req.body);
  console.log('Received file:', req.file);

  // Kiểm tra nếu không có file ảnh
  let imageUrl = null;
  if (req.file) {
    try {
      // Upload file lên Cloudinary
      const cloudinaryResult = await uploadToCloudinary(req.file);
      imageUrl = cloudinaryResult.secure_url;  // Lấy URL của ảnh đã upload
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error });
    }
  }

  // Cấu trúc query SQL để cập nhật thông tin khách sạn
  const query =
    `UPDATE hotels
     SET name = ?, address = ?, city = ?, country = ?, rating = ?, phone = ?, room = ?, image = ?
     WHERE hotel_id = ?`;

  // Thực thi query để cập nhật thông tin khách sạn
  connection.query(
    query,
    [
      name || null,        // Nếu không có giá trị thì set thành null
      address || null,
      city || null,
      country || null,
      rating || null,
      phone,
      room || 0,
      imageUrl || null,    // Nếu không có ảnh mới thì giữ nguyên ảnh cũ (null nếu không có ảnh)
      hotelId              // ID khách sạn để xác định cần update
    ],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating hotel', error: err });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Nếu thành công, trả về thông tin khách sạn đã cập nhật
      res.status(200).json({ message: 'Hotel updated successfully' });
    }
  );
});

// Xóa khách sạn
router.delete('/:hotel_id', async (req, res) => {
  const hotelId = req.params.hotel_id; // Lấy hotel_id từ params

  try {
    // Xóa các phòng liên quan đến khách sạn
    const deleteRoomsQuery = 'DELETE FROM rooms WHERE hotel_id = ?';
    connection.query(deleteRoomsQuery, [hotelId], (err, results) => {
      if (err) {
        console.error('Error deleting rooms:', err);
        return res.status(500).json({ message: 'Error deleting rooms', error: err });
      }

      // Xóa khách sạn
      const deleteHotelQuery = 'DELETE FROM hotels WHERE hotel_id = ?';
      connection.query(deleteHotelQuery, [hotelId], (err, results) => {
        if (err) {
          console.error('Error deleting hotel:', err);
          return res.status(500).json({ message: 'Error deleting hotel', error: err });
        }

        // Kiểm tra nếu không có khách sạn nào bị xóa
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Hotel not found' });
        }

        // Trả về kết quả thành công
        res.json({ message: 'Hotel and associated rooms deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Error deleting hotel and rooms:', error);
    res.status(500).json({ message: 'Failed to delete hotel and rooms', error: error });
  }
});

// Lấy khách sạn của người dùng (sửa lại)
router.get("/user/:user_id", (req, res) => {
  const { user_id } = req.params; // Lấy user_id từ tham số đường dẫn

  connection.promise() // Sử dụng API promise() của mysql2
    .query("SELECT * FROM hotels WHERE user_id = ?", [user_id])
    .then(([hotels]) => { // Dữ liệu trả về dưới dạng mảng, phần tử đầu tiên là kết quả
      console.log('Khách sạn lấy được:', hotels); // Ghi log kết quả

      if (!hotels || hotels.length === 0) {
        return res.status(404).json({ message: `Không có khách sạn nào cho user_id ${user_id}` });
      }

      res.status(200).json(hotels);
    })
    .catch(error => {
      console.error("Lỗi khi lấy khách sạn:", error); // Ghi log lỗi
      res.status(500).json({ message: "Lỗi khi lấy thông tin khách sạn của người dùng" });
    });
});
module.exports = router;
