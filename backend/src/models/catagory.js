// models/category.js
const connection = require('../config/db');  // Import MySQL connection

// Category Model
class Category {
  // Get all categories
  static async getAll() {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM categories');
      return rows;  // Returns all categories
    } catch (err) {
      throw new Error('Error fetching categories: ' + err.message);
    }
  }

  // Get category by ID
  static async getById(id) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM categories WHERE CategoryID = ?', [id]);
      return rows[0];  // Returns the category or undefined if not found
    } catch (err) {
      throw new Error('Error fetching category: ' + err.message);
    }
  }

  // Create a new category
  static async create(categoryData) {
    try {
      const { CategoryName, Description } = categoryData;
      const [result] = await connection.promise().query(
        'INSERT INTO categories (CategoryName, Description) VALUES (?, ?)', 
        [CategoryName, Description || null]  // Default to NULL if no description is provided
      );
      return result.insertId;  // Return the ID of the newly inserted category
    } catch (err) {
      throw new Error('Error creating category: ' + err.message);
    }
  }

  // Update an existing category
  static async update(id, categoryData) {
    try {
      const { CategoryName, Description } = categoryData;
      await connection.promise().query(
        'UPDATE categories SET CategoryName = ?, Description = ? WHERE CategoryID = ?', 
        [CategoryName, Description || null, id]
      );
      return true;  // Return true if update is successful
    } catch (err) {
      throw new Error('Error updating category: ' + err.message);
    }
  }

  // Delete a category
  static async delete(id) {
    try {
      await connection.promise().query('DELETE FROM categories WHERE CategoryID = ?', [id]);
      return true;  // Return true if deletion is successful
    } catch (err) {
      throw new Error('Error deleting category: ' + err.message);
    }
  }
}

module.exports = Category;
