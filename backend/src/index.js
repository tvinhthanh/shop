const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Enable CORS for the frontend URL (allowing credentials) before other routes
app.use(cors({
    origin: 'http://localhost:5174',  // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Enable cookies and credentials
}));

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Import userRoutes and authRoutes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Create a MySQL connection pool (recommended for production)
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,  // Adjust based on your load
});

// Test database connection
app.get('/test-db', (req, res) => {
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection error', error: err });
        }
        res.status(200).json({ message: 'Database connected successfully', solution: results[0].solution });
    });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server on port 8800
app.listen(8800, () => {
    console.log("Backend server running on port 8800");
});
