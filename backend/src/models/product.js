// models/product.js
const connection = require('../config/db');  // Import MySQL connection

// Product Model
class Product {
  // Get all products
  static async getAll() {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM products');
      return rows;  // Returns all products
    } catch (err) {
      throw new Error('Error fetching products: ' + err.message);
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM products WHERE ProductID = ?', [id]);
      return rows[0];  // Returns the first product or undefined if not found
    } catch (err) {
      throw new Error('Error fetching product: ' + err.message);
    }
  }

  // Add a new product
  static async create(productData) {
    try {
      const { ProductName, CategoryID, Price, Stock, ImageURL, Description } = productData;
      const [result] = await connection.promise().query(
        'INSERT INTO products (ProductName, CategoryID, Price, Stock, ImageURL, Description) VALUES (?, ?, ?, ?, ?, ?)', 
        [ProductName, CategoryID, Price, Stock, ImageURL, Description]
      );
      return result.insertId;  // Return the ID of the newly inserted product
    } catch (err) {
      throw new Error('Error creating product: ' + err.message);
    }
  }

  // Update an existing product
  static async update(id, productData) {
    try {
      const { ProductName, CategoryID, Price, Stock, ImageURL, Description } = productData;
      await connection.promise().query(
        'UPDATE products SET ProductName = ?, CategoryID = ?, Price = ?, Stock = ?, ImageURL = ?, Description = ? WHERE ProductID = ?', 
        [ProductName, CategoryID, Price, Stock, ImageURL, Description, id]
      );
      return true;  // Return true if update is successful
    } catch (err) {
      throw new Error('Error updating product: ' + err.message);
    }
  }

  // Delete a product
  static async delete(id) {
    try {
      await connection.promise().query('DELETE FROM products WHERE ProductID = ?', [id]);
      return true;  // Return true if deletion is successful
    } catch (err) {
      throw new Error('Error deleting product: ' + err.message);
    }
  }

  // Get products by category
  static async getByCategory(categoryId) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM products WHERE CategoryID = ?', [categoryId]);
      return rows;  // Returns products by category
    } catch (err) {
      throw new Error('Error fetching products by category: ' + err.message);
    }
  }
}

module.exports = Product;
