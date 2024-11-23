// models/order.js
const connection = require('../config/db');  // Import MySQL connection

// Order Model
class Order {
  // Get all orders
  static async getAll() {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM orders');
      return rows;  // Returns all orders
    } catch (err) {
      throw new Error('Error fetching orders: ' + err.message);
    }
  }

  // Get order by OrderID
  static async getById(orderId) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM orders WHERE OrderID = ?', [orderId]);
      return rows[0];  // Returns the order for the given OrderID
    } catch (err) {
      throw new Error('Error fetching order: ' + err.message);
    }
  }

  // Create a new order
  static async create(orderData) {
    try {
      const { CustomerID, TotalAmount, Status } = orderData;
      const [result] = await connection.promise().query(
        'INSERT INTO orders (CustomerID, TotalAmount, Status) VALUES (?, ?, ?)', 
        [CustomerID, TotalAmount, Status]
      );
      return result.insertId;  // Return the ID of the newly inserted order
    } catch (err) {
      throw new Error('Error creating order: ' + err.message);
    }
  }

  // Update an existing order
  static async update(id, orderData) {
    try {
      const { Status, TotalAmount } = orderData;
      await connection.promise().query(
        'UPDATE orders SET Status = ?, TotalAmount = ? WHERE OrderID = ?', 
        [Status, TotalAmount, id]
      );
      return true;  // Return true if update is successful
    } catch (err) {
      throw new Error('Error updating order: ' + err.message);
    }
  }

  // Delete an order
  static async delete(id) {
    try {
      await connection.promise().query('DELETE FROM orders WHERE OrderID = ?', [id]);
      return true;  // Return true if deletion is successful
    } catch (err) {
      throw new Error('Error deleting order: ' + err.message);
    }
  }
}

module.exports = Order;
