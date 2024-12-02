const mysql = require('mysql2');

// Create a connection pool for better performance and scalability
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Database host from environment variables
  user: process.env.DB_USER,       // Database username from environment variables
  password: process.env.DB_PASS,   // Database password from environment variables
  database: process.env.DB_NAME,   // Database name from environment variables
  waitForConnections: true,        // Wait for a connection if the pool is busy
  connectionLimit: 10,             // Max number of simultaneous connections in the pool
  queueLimit: 0                    // No limit to the number of queued connection requests
});

// Export the promise-based pool for async/await queries
module.exports = pool.promise();
