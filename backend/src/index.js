const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the CORS package
dotenv.config();

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://your-frontend-url.com']; // Add your allowed origins here

// Import routes
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/catagory'); // Corrected typo in category route
const deliveryNoteRoutes = require('./routes/deliverynote');
const authRoutes = require('./routes/auth');

// Create the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes with a dynamic origin check
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the origin
    }
  }
}));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/delivery-notes', deliveryNoteRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
