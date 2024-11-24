const mysql = require('mysql2');

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Use environment variables for configuration
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporting the promise-based pool for async/await queries
module.exports = pool.promise();
