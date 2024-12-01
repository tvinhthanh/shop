const express = require('express');
const Booking = require('../models/booking'); // Import Booking model
const router = express.Router();
const connection = require('../config/database'); // Import database connection

// Route to get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err });
  }
});

// Route to get bookings by user ID
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookings = await Booking.getByUserId(userId);
    if (bookings.length > 0) {
      res.json(bookings);
    } else {
      res.status(404).json({ message: 'No bookings found for this user' });
    }
  } catch (err) {
    console.error('Error fetching bookings for user:', err);
    res.status(500).json({ message: 'Error fetching bookings for user', error: err });
  }
});

// Route to get bookings by hotel ID
router.get('/hotel/:hotelId', async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    const bookings = await Booking.getByHotelId(hotelId);
    if (bookings.length > 0) {
      res.json(bookings);
    } else {
      res.status(404).json({ message: 'No bookings found for this hotel' });
    }
  } catch (err) {
    console.error('Error fetching bookings for hotel:', err);
    res.status(500).json({ message: 'Error fetching bookings for hotel', error: err });
  }
});

// Route to get a single booking by ID
router.get('/:id', async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.getById(bookingId);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Error fetching booking', error: err });
  }
});

// Route to create a new booking
router.post('/', async (req, res) => {
  const {
    hotel_id,
    room_id,
    user_id,
    check_in_date,
    check_out_date,
    total_price,
    booking_status,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!hotel_id || !room_id || !user_id || !check_in_date || !check_out_date || !total_price || !booking_status) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  try {
    const newBooking = {
      hotel_id,
      room_id,
      user_id,
      check_in_date,
      check_out_date,
      total_price,
      booking_status,
    };

    // Thêm booking mới vào database
    const bookingId = await Booking.create(newBooking);

    // Nếu thành công, giảm số lượng phòng khả dụng trong bảng rooms
    const updateRoomQuery = `
      UPDATE rooms
      SET availability_status = availability_status - 1
      WHERE id_room = ?
    `;
    connection.query(updateRoomQuery, [room_id], (err) => {
      if (err) {
        console.error('Lỗi khi cập nhật trạng thái phòng:', err);
        return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái phòng', error: err });
      }

      res.status(201).json({
        message: 'Booking thành công!',
        booking_id: bookingId,
      });
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Error creating booking', error: err });
  }
});

// Route to update a booking
router.put('/:id', async (req, res) => {
  const bookingId = req.params.id;
  const bookingData = req.body;

  try {
    const affectedRows = await Booking.update(bookingId, bookingData);
    if (affectedRows > 0) {
      res.json({ message: 'Booking updated successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Error updating booking', error: err });
  }
});

// Route to delete a booking
router.delete('/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    const affectedRows = await Booking.delete(bookingId);
    if (affectedRows > 0) {
      res.json({ message: 'Booking deleted successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Error deleting booking', error: err });
  }
});

module.exports = router;
