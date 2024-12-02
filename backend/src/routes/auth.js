const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', [
  body('FullName').notEmpty().withMessage('Full Name is required'),
  body('Email').isEmail().withMessage('Valid Email is required'),
  body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('ConfirmPassword').custom((value, { req }) => value === req.body.Password).withMessage('Passwords must match')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { FullName, Email, Phone, Address, Password, role } = req.body;

  try {
    // Check if the user already exists based on email
    const existingUser = await User.findByEmail(Email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create the new user
    const userId = await User.create({
      FullName,
      Email,
      Phone,
      Address,
      Password: hashedPassword,
      role: role || 'user', // Default to 'user' if no role is provided
    });

    // Generate JWT token for the user
    const token = jwt.sign({ userId: userId._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send success response with the token
    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during registration' });
  }
});




router.post('/login', [
  body('Email').isEmail().withMessage('Valid Email is required'),
  body('Password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Email, Password } = req.body;

  try {
    const user = await User.findByEmail(Email);  // Assuming a method to find by email
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,  // Sending token in the response
      userId: user.userId,  // Also send userId and role if needed for frontend
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});
router.get('/logout2', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});
function verifyToken(req, res, next) {
  // Retrieve the token from cookies
  const token = req.cookies["auth_token"];
  
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}

router.get("/validate-token", verifyToken, (req, res) => {
  // Decode the token and send user info
  const token = req.cookies["auth_token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  res.status(200).json({
    userId: req.userId,
    userRole: decoded.req.role,
    token,
  });
});
module.exports = router;  // Chỉ export router, không cần thêm { authRouter }
