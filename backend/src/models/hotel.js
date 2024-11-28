const mysql = require('mysql2/promise'); // Use mysql2 with Promise support
require('dotenv').config(); // Use environment variables for DB configuration

// Create MySQL connection pool
const connection = mysql.createPool({
  host: process.env.DB_HOST,       // Example: 'localhost'
  user: process.env.DB_USER,       // Example: 'root'
  password: process.env.DB_PASSWORD, // Example: ''
  database: process.env.DB_NAME,    // Example: 'dacn'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create the hotels table if it does not exist
(async () => {
  const createHotelTable = `
    CREATE TABLE IF NOT EXISTS hotels (
      id_hotel INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255),
      country VARCHAR(255),
      rating DECIMAL(3, 2),
      phone VARCHAR(15),
      room INT,
      image VARCHAR(255)  -- Added image field
    );
  `;
  try {
    await connection.execute(createHotelTable);
    console.log('Table "hotels" created or already exists.');
  } catch (err) {
    console.error('Error creating "hotels" table:', err);
  }
})();

// Hotel Model
const Hotel = {
  // Get all hotels
  getAll: async () => {
    const query = 'SELECT * FROM hotels';
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (err) {
      console.error('Error fetching all hotels:', err);
      throw err;
    }
  },

  // Get hotel by specific field and value
  findOne: async (field, value) => {
    if (!field || value === undefined) {
      throw new Error('Field and value are required for findOne');
    }
    const query = `SELECT * FROM hotels WHERE ${field} = ? LIMIT 1`;
    try {
      const [results] = await connection.execute(query, [value]);
      return results[0] || null;
    } catch (err) {
      console.error('Error finding hotel by field:', err);
      throw err;
    }
  },

  // Get hotel by ID
  getById: async (id) => {
    const query = 'SELECT * FROM hotels WHERE id_hotel = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0] || null; // Return the single record
    } catch (err) {
      console.error('Error fetching hotel by ID:', err);
      throw err;
    }
  },

  // Create a new hotel
  create: async (hotelData) => {
    const query = `
      INSERT INTO hotels (name, address, city, country, phone, rating, room, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { name, address, city, country, phone, rating, room, image } = hotelData;
    try {
      const [results] = await connection.execute(query, [
        name, address, city, country, phone, rating, room, image
      ]);
      return results.insertId; // Return the new hotel ID
    } catch (err) {
      console.error('Error creating hotel:', err);
      throw err;
    }
  },

  // Update hotel information
  update: async (id, hotelData) => {
    const query = `
      UPDATE hotels
      SET name = ?, address = ?, city = ?, country = ?, phone = ?, rating = ?, room = ?, image = ?
      WHERE id_hotel = ?
    `;
    const { name, address, city, country, phone, rating, room, image } = hotelData;
    try {
      const [results] = await connection.execute(query, [
        name, address, city, country, phone, rating, room, image, id
      ]);
      return results.affectedRows; // Return number of affected rows
    } catch (err) {
      console.error('Error updating hotel:', err);
      throw err;
    }
  },

  // Delete a hotel
  delete: async (id) => {
    const query = 'DELETE FROM hotels WHERE id_hotel = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results.affectedRows; // Return number of affected rows
    } catch (err) {
      console.error('Error deleting hotel:', err);
      throw err;
    }
  }
};

// Export the Hotel model to use in other files
module.exports = Hotel;
