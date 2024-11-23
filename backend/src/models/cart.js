// models/cart.js
const connection = require('../config/db');  // Import MySQL connection

// Cart Model
class Cart {
  // Get all cart items for a specific customer
  static async getByCustomerId(customerId) {
    try {
      const [rows] = await connection.promise().query(
        'SELECT * FROM cart WHERE CustomerID = ?', [customerId]
      );
      return rows;  // Returns all cart items for a specific customer
    } catch (err) {
      throw new Error('Error fetching cart items: ' + err.message);
    }
  }

  // Add a product to the cart
  static async addToCart(customerId, productId, quantity) {
    try {
      // Check if the product is already in the cart
      const [existingCartItem] = await connection.promise().query(
        'SELECT * FROM cart WHERE CustomerID = ? AND ProductID = ?', [customerId, productId]
      );

      if (existingCartItem.length > 0) {
        // If product exists, update the quantity
        await connection.promise().query(
          'UPDATE cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?',
          [quantity, customerId, productId]
        );
        return 'Quantity updated in the cart';
      } else {
        // Otherwise, add a new entry to the cart
        const [result] = await connection.promise().query(
          'INSERT INTO cart (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)',
          [customerId, productId, quantity]
        );
        return result.insertId;  // Return the ID of the newly inserted cart item
      }
    } catch (err) {
      throw new Error('Error adding to cart: ' + err.message);
    }
  }

  // Update the quantity of a product in the cart
  static async updateQuantity(cartId, quantity) {
    try {
      await connection.promise().query(
        'UPDATE cart SET Quantity = ? WHERE CartID = ?', [quantity, cartId]
      );
      return 'Cart updated successfully';
    } catch (err) {
      throw new Error('Error updating cart: ' + err.message);
    }
  }

  // Remove a product from the cart
  static async removeFromCart(cartId) {
    try {
      await connection.promise().query('DELETE FROM cart WHERE CartID = ?', [cartId]);
      return 'Product removed from the cart';
    } catch (err) {
      throw new Error('Error removing product from cart: ' + err.message);
    }
  }

  // Clear all items in the cart for a specific customer
  static async clearCart(customerId) {
    try {
      await connection.promise().query('DELETE FROM cart WHERE CustomerID = ?', [customerId]);
      return 'Cart cleared successfully';
    } catch (err) {
      throw new Error('Error clearing cart: ' + err.message);
    }
  }
}

module.exports = Cart;
