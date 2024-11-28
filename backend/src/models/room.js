const mysql = require('mysql2/promise'); // MySQL2 with Promise support
require('dotenv').config(); // Load environment variables

// Create a MySQL connection pool
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create the `rooms` table if it doesn't exist
(async () => {
  const createRoomTable = `
    CREATE TABLE IF NOT EXISTS rooms (
      room_id INT AUTO_INCREMENT PRIMARY KEY,           -- Room ID (Primary Key)
      hotel_id INT NOT NULL,                             -- Hotel ID (Foreign Key)
      room_type VARCHAR(50),                             -- Room type (e.g., Standard, Deluxe)
      price DECIMAL(10, 2),                              -- Price per night
      adult_count INT,                                   -- Number of adults the room can accommodate
      child_count INT,                                   -- Number of children the room can accommodate
      facilities JSON,                                   -- JSON to store facilities like ["WiFi", "AC", "TV"]
      image_urls JSON,                                   -- Array of image URLs stored as JSON
      availability_status TINYINT(1) DEFAULT 1,          -- Availability status (1 = available, 0 = not available)

      -- Foreign key references
      FOREIGN KEY (hotel_id) REFERENCES hotels(id_hotel)
    );
  `;
  try {
    await connection.execute(createRoomTable);
    console.log('Table "rooms" created or already exists.');
  } catch (err) {
    console.error('Error creating "rooms" table:', err.message);
  }
})();

// Define the Room model with CRUD operations
const Room = {
  /**
   * Get all rooms.
   * @returns {Promise<Array>} List of all rooms.
   */
  getAll: async () => {
    const query = 'SELECT * FROM rooms';
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (err) {
      console.error('Error fetching all rooms:', err.message);
      throw err;
    }
  },

  /**
   * Find a room by a specific field and value.
   * @param {string} field - Field name to filter by.
   * @param {any} value - Value of the field to match.
   * @returns {Promise<Object|null>} The room object or null.
   */
  findOne: async (field, value) => {
    if (!field || value === undefined || value === null) {
      throw new Error('Field and valid value are required for findOne');
    }
    const query = `SELECT * FROM rooms WHERE ${field} = ? LIMIT 1`;
    try {
      const [results] = await connection.execute(query, [value]);
      return results[0] || null;
    } catch (err) {
      console.error(`Error finding room by field "${field}":`, err.message);
      throw err;
    }
  },

  /**
   * Get a room by ID.
   * @param {number} id - Room ID.
   * @returns {Promise<Object|null>} The room object or null.
   */
  getById: async (id) => {
    const query = 'SELECT * FROM rooms WHERE room_id = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0] || null;
    } catch (err) {
      console.error('Error fetching room by ID:', err.message);
      throw err;
    }
  },

  /**
   * Create a new room.
   * @param {Object} roomData - Room data to insert.
   * @returns {Promise<number>} The ID of the newly created room.
   */
  create: async (roomData) => {
    const query = `
      INSERT INTO rooms (hotel_id, room_type, price, adult_count, child_count, facilities, image_urls, availability_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Destructure the room data and assign default values if fields are undefined
    const {
      hotel_id,
      room_type,
      price,
      adult_count,
      child_count,
      facilities = [],  // Default to an empty array if undefined
      image_urls = [],  // Default to an empty array if undefined
      availability_status = 1, // Default to 1 (available) if undefined
    } = roomData;
  
    // Ensure that required fields are not undefined (set to NULL if necessary)
    if (hotel_id === undefined || room_type === undefined || price === undefined || adult_count === undefined || child_count === undefined) {
      throw new Error('Required fields are missing');
    }
  
    // Ensure that null values are passed correctly
    const safeFacilities = facilities ? JSON.stringify(facilities) : null;
    const safeImageUrls = image_urls ? JSON.stringify(image_urls) : null;
  
    try {
      const [results] = await connection.execute(query, [
        hotel_id, 
        room_type, 
        price, 
        adult_count, 
        child_count, 
        safeFacilities, 
        safeImageUrls, 
        availability_status
      ]);
      return results.insertId; // The ID of the newly created room
    } catch (err) {
      console.error('Error creating room:', err);
      throw err;
    }
  },
  
  /**
   * Get rooms by hotel ID.
   * @param {number} hotelId - Hotel ID.
   * @returns {Promise<Array>} List of rooms for the specified hotel.
   */
  getByHotelId: async (hotelId) => {
    const query = 'SELECT * FROM rooms WHERE hotel_id = ?';
    try {
      const [results] = await connection.execute(query, [hotelId]);
      return results; // Returns an array of rooms for the hotel
    } catch (err) {
      console.error('Error fetching rooms by hotel ID:', err.message);
      throw err;
    }
  },

  /**
   * Update an existing room's information.
   * @param {number} id - Room ID to update.
   * @param {Object} roomData - Updated room data.
   * @returns {Promise<number>} Number of affected rows.
   */
  update: async (id, roomData) => {
    const updates = [];
    const values = [];
    
    Object.entries(roomData).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(key === 'facilities' || key === 'image_urls' ? JSON.stringify(value) : value);
    });

    values.push(id); // Add ID at the end for the WHERE clause

    const query = `UPDATE rooms SET ${updates.join(', ')} WHERE room_id = ?`;

    try {
      const [results] = await connection.execute(query, values);
      return results.affectedRows; // Return the number of affected rows
    } catch (err) {
      console.error('Error updating room:', err.message);
      throw err;
    }
  },

  /**
   * Delete a room by ID.
   * @param {number} id - Room ID to delete.
   * @returns {Promise<number>} Number of affected rows.
   */
  delete: async (id) => {
    const query = 'DELETE FROM rooms WHERE room_id = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results.affectedRows; // Return the number of affected rows
    } catch (err) {
      console.error('Error deleting room:', err.message);
      throw err;
    }
  }
};

// Export the Room model for use in other files
module.exports = Room;
