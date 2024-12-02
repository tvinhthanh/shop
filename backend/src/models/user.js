// models/user.js
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Import the pool from the config

// User Model
class User {
  // Get all users
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows;
    } catch (err) {
      throw new Error('Error fetching users: ' + err.message);
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE userId = ?', [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error fetching user: ' + err.message);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
      return rows[0]; // Return the first user found or undefined if not found
    } catch (err) {
      throw new Error('Error fetching user by email: ' + err.message);
    }
  }

  // Create a new user (registration)
  static async create(userData) {
    try {
      const { FullName, Email, Phone, Address, Password, role } = userData;

      // Check if the email is already used
      const existingUser = await User.findByEmail(Email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Insert the user into the database
      const [result] = await pool.query(
        'INSERT INTO users (FullName, Email, Phone, Address, Password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [FullName, Email, Phone, Address, hashedPassword, role || 0]
      );

      // Return the newly created user object
      const newUser = { userId: result.insertId, FullName, Email, Phone, Address, role: role || 0 };
      return newUser;
    } catch (err) {
      throw new Error('Error creating user: ' + err.message);
    }
  }

  // Update an existing user
  static async update(id, userData) {
    try {
      const { FullName, Email, Phone, Address, Password, role } = userData;
      let hashedPassword;

      // If password is provided, hash it
      if (Password) {
        hashedPassword = await bcrypt.hash(Password, 10);
      }

      // Update user query
      const query = `
        UPDATE users 
        SET FullName = ?, Email = ?, Phone = ?, Address = ?, Password = COALESCE(?, Password), role = ? 
        WHERE userId = ?
      `;

      await pool.query(query, [
        FullName,
        Email,
        Phone,
        Address,
        hashedPassword,
        role,
        id,
      ]);

      return true;
    } catch (err) {
      throw new Error('Error updating user: ' + err.message);
    }
  }

  // Delete a user
  static async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE userId = ?', [id]);
      return true;
    } catch (err) {
      throw new Error('Error deleting user: ' + err.message);
    }
  }
}

module.exports = User;
