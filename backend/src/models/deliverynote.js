// models/deliveryNote.js
const connection = require('../config/db');  // Import MySQL connection

// DeliveryNote Model
class DeliveryNote {
  // Get all delivery notes
  static async getAll() {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM delivery_notes');
      return rows;  // Returns all delivery notes
    } catch (err) {
      throw new Error('Error fetching delivery notes: ' + err.message);
    }
  }

  // Get delivery note by ID
  static async getById(id) {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM delivery_notes WHERE DeliveryNoteID = ?', [id]);
      return rows[0];  // Returns the delivery note or undefined if not found
    } catch (err) {
      throw new Error('Error fetching delivery note: ' + err.message);
    }
  }

  // Create a new delivery note
  static async create(deliveryNoteData) {
    try {
      const { OrderID, DeliveryDate, DeliveryAddress, Status, Note } = deliveryNoteData;
      const [result] = await connection.promise().query(
        'INSERT INTO delivery_notes (OrderID, DeliveryDate, DeliveryAddress, Status, Note) VALUES (?, ?, ?, ?, ?)', 
        [OrderID, DeliveryDate, DeliveryAddress, Status || 'Pending', Note || null]  // Default status 'Pending' if not provided
      );
      return result.insertId;  // Return the ID of the newly inserted delivery note
    } catch (err) {
      throw new Error('Error creating delivery note: ' + err.message);
    }
  }

  // Update an existing delivery note
  static async update(id, deliveryNoteData) {
    try {
      const { DeliveryDate, DeliveryAddress, Status, Note } = deliveryNoteData;
      await connection.promise().query(
        'UPDATE delivery_notes SET DeliveryDate = ?, DeliveryAddress = ?, Status = ?, Note = ? WHERE DeliveryNoteID = ?', 
        [DeliveryDate, DeliveryAddress, Status, Note || null, id]
      );
      return true;  // Return true if update is successful
    } catch (err) {
      throw new Error('Error updating delivery note: ' + err.message);
    }
  }

  // Delete a delivery note
  static async delete(id) {
    try {
      await connection.promise().query('DELETE FROM delivery_notes WHERE DeliveryNoteID = ?', [id]);
      return true;  // Return true if deletion is successful
    } catch (err) {
      throw new Error('Error deleting delivery note: ' + err.message);
    }
  }
}

module.exports = DeliveryNote;
