const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Import routes
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/catagory'); // Đúng chính tả
const deliveryNoteRoutes = require('./routes/deliverynote');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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
