// models/orderDetail.js
const connection = require('../config/db');  // Import MySQL connection

// OrderDetail Model
class OrderDetail {
  // Get all order details
  static async getAll() {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM order_details');
      return rows;  // Returns all order details
    } catch (err) {
      throw new Error('Error fetching order details: ' + err.message);
    }
  }

  // Get order details by OrderID
  static async getByOrderId(orderId) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM order_details WHERE OrderID = ?', [orderId]);
      return rows;  // Returns the order details for the given order ID
    } catch (err) {
      throw new Error('Error fetching order details: ' + err.message);
    }
  }

  // Create a new order detail
  static async create(orderDetailData) {
    try {
      const { OrderID, ProductID, Quantity, UnitPrice } = orderDetailData;
      const [result] = await connection.promise().query(
        'INSERT INTO order_details (OrderID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)', 
        [OrderID, ProductID, Quantity, UnitPrice]
      );
      return result.insertId;  // Return the ID of the newly inserted order detail
    } catch (err) {
      throw new Error('Error creating order detail: ' + err.message);
    }
  }

  // Update an existing order detail
  static async update(id, orderDetailData) {
    try {
      const { Quantity, UnitPrice } = orderDetailData;
      await connection.promise().query(
        'UPDATE order_details SET Quantity = ?, UnitPrice = ? WHERE OrderDetailID = ?', 
        [Quantity, UnitPrice, id]
      );
      return true;  // Return true if update is successful
    } catch (err) {
      throw new Error('Error updating order detail: ' + err.message);
    }
  }

  // Delete an order detail
  static async delete(id) {
    try {
      await connection.promise().query('DELETE FROM order_details WHERE OrderDetailID = ?', [id]);
      return true;  // Return true if deletion is successful
    } catch (err) {
      throw new Error('Error deleting order detail: ' + err.message);
    }
  }
}

module.exports = OrderDetail;
