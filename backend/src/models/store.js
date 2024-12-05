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

// Create the stores table if it does not exist
(async () => {
  const createStoreTable = `
    CREATE TABLE IF NOT EXISTS stores (
      store_id INT AUTO_INCREMENT PRIMARY KEY,
      store_name VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,  -- Assuming user_id is a foreign key to a users table
      address VARCHAR(255) NOT NULL,
      image VARCHAR(255),    -- Image URL or path for the store image
      FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
    );
  `;
  try {
    await connection.execute(createStoreTable);
    console.log('Table "stores" created or already exists.');
  } catch (err) {
    console.error('Error creating "stores" table:', err);
  }
})();

// Store Model
const Store = {
  // Get all stores
  getAll: async () => {
    const query = 'SELECT * FROM stores';
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (err) {
      console.error('Error fetching all stores:', err);
      throw err;
    }
  },

  // Get store by specific field and value
  findOne: async (field, value) => {
    if (!field || value === undefined) {
      throw new Error('Field and value are required for findOne');
    }
    const query = `SELECT * FROM stores WHERE ${field} = ? LIMIT 1`;
    try {
      const [results] = await connection.execute(query, [value]);
      return results[0] || null;
    } catch (err) {
      console.error('Error finding store by field:', err);
      throw err;
    }
  },

  // Get store by ID
  getById: async (id) => {
    const query = 'SELECT * FROM stores WHERE store_id = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0] || null; // Return the single record
    } catch (err) {
      console.error('Error fetching store by ID:', err);
      throw err;
    }
  },

  // Create a new store
  create: async (storeData) => {
    const query = `
      INSERT INTO stores (store_name, user_id, address, image)
      VALUES (?, ?, ?, ?)
    `;
    const { store_name, user_id, address, image } = storeData;
    try {
      const [results] = await connection.execute(query, [
        store_name, user_id, address, image
      ]);
      return results.insertId; // Return the new store ID
    } catch (err) {
      console.error('Error creating store:', err);
      throw err;
    }
  },

  // Update store information
  update: async (id, storeData) => {
    const query = `
      UPDATE stores
      SET store_name = ?, user_id = ?, address = ?, image = ?
      WHERE store_id = ?
    `;
    const { store_name, user_id, address, image } = storeData;
    try {
      const [results] = await connection.execute(query, [
        store_name, user_id, address, image, id
      ]);
      return results.affectedRows; // Return number of affected rows
    } catch (err) {
      console.error('Error updating store:', err);
      throw err;
    }
  },

  // Delete a store
  delete: async (id) => {
    const query = 'DELETE FROM stores WHERE store_id = ?';
    try {
      const [results] = await connection.execute(query, [id]);
      return results.affectedRows; // Return number of affected rows
    } catch (err) {
      console.error('Error deleting store:', err);
      throw err;
    }
  }
};

// Export the Store model to use in other files
module.exports = Store;
