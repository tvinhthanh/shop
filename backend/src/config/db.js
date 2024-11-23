// config/db.js
const mysql = require('mysql2');

// Create a connection pool for better performance
const connection = mysql.createPool({
  host: process.env.DB_HOST,  // Use environment variables for configuration
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;
