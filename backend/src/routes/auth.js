const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', [
  body('FullName').notEmpty().withMessage('Full Name is required'),
  body('Email').isEmail().withMessage('Valid Email is required'),
  body('PasswordHash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('ConfirmPassword').custom((value, { req }) => value === req.body.PasswordHash).withMessage('Passwords must match')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { FullName, Email, Phone, Address, PasswordHash, role } = req.body;

  try {
    const existingUser = await User.findByEmail(Email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(PasswordHash, 10);
    const userId = await User.create({ FullName, Email, Phone, Address, PasswordHash, role });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Đăng nhập người dùng
router.post('/login', [
  body('Email').isEmail().withMessage('Valid Email is required'),
  body('PasswordHash').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Email, PasswordHash } = req.body;

  try {
    const user = await User.findByEmail(Email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(PasswordHash, user.PasswordHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
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

module.exports = router;  // Chỉ export router, không cần thêm { authRouter }
