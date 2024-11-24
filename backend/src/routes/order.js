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

// // Update an existing order
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Order.update(req.params.id, req.body);
//     if (updated) {
//       res.json({ message: 'Order updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Order not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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

router.post('/checkout', async (req, res) => {
  const { CustomerID } = req.body;

  if (!CustomerID) {
    return res.status(400).json({ error: 'CustomerID is required' });
  }

  const db = require('../config/db');

  let connection;
  try {
    // Lấy một kết nối và bắt đầu giao dịch
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // Lấy thông tin giỏ hàng từ bảng `Cart` và tính tổng tiền
    const [cartItems] = await connection.query(
      `SELECT 
          c.ProductID, 
          c.Quantity, 
          p.Price AS UnitPrice 
       FROM Cart c 
       JOIN Products p ON c.ProductID = p.ProductID 
       WHERE c.CustomerID = ?`,
      [CustomerID]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Tính tổng số tiền
    const totalAmount = cartItems.reduce((total, item) => total + item.Quantity * item.UnitPrice, 0);

    // Tạo đơn hàng mới
    const [orderResult] = await connection.query(
      'INSERT INTO Orders (CustomerID, TotalAmount, Status) VALUES (?, ?, ?)',
      [CustomerID, totalAmount, 'Pending']
    );
    const orderId = orderResult.insertId;

    // Thêm thông tin từ giỏ hàng vào bảng `OrderDetails`
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)',
        [orderId, item.ProductID, item.Quantity, item.UnitPrice]
      );
    }

    // Xóa giỏ hàng của khách hàng
    await connection.query(
      'DELETE FROM Cart WHERE CustomerID = ?',
      [CustomerID]
    );

    // Xác nhận giao dịch
    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      totalAmount,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).json({ error: 'Error processing order: ' + err.message });
  } finally {
    if (connection) await connection.release(); // Trả kết nối về pool
  }
});

// Update order status and create delivery note
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  let connectionInstance;
  try {
    connectionInstance = await connection.getConnection();  // Get connection from pool
    await connectionInstance.beginTransaction();

    // Update order status
    await connectionInstance.query(
      'UPDATE Orders SET Status = ? WHERE OrderID = ?',
      [status, orderId]
    );

    if (status === 'accept') {
      // Get customer information from Users table
      const [userInfo] = await connectionInstance.query(
        'SELECT FullName, Address, Phone FROM Users WHERE UserID = (SELECT CustomerID FROM Orders WHERE OrderID = ?)',
        [orderId]
      );

      if (userInfo.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { FullName, Address, Phone } = userInfo[0];

      // Create delivery note
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2); // Set delivery date to 2 days later

      const formattedDeliveryDate = deliveryDate.toISOString().slice(0, 19).replace('T', ' ');  // Format date for SQL

      await connectionInstance.query(
        'INSERT INTO DeliveryNotes (OrderID, DeliveryDate, DeliveryAddress, Status, Note) VALUES (?, ?, ?, ?, ?)',
        [orderId, formattedDeliveryDate, Address, 'Pending', null]
      );
    }

    await connectionInstance.commit();
    res.status(200).json({ message: `Order status updated to '${status}' successfully` });
  } catch (err) {
    if (connectionInstance) {
      await connectionInstance.rollback();
    }
    res.status(500).json({ error: 'Error updating order status: ' + err.message });
  } finally {
    if (connectionInstance) {
      connectionInstance.release();  // Release the connection back to the pool
    }
  }
});

module.exports = router;
