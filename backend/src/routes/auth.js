const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/user"); // Assuming you have a User model to interact with DB
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Ensure this is declared once
const verifyToken = require("../middleware/auth"); // Assuming verifyToken middleware
const router = express.Router();
const validateToken = (req, res, next) => {
    const token = req.cookies["auth_token"] || req.headers["authorization"];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      req.user = decoded;
      next();
    });
  };

  
router.post(
    "/register",
    [
      check("firstName", "First Name is required").notEmpty(),
      check("lastName", "Last Name is required").notEmpty(),
      check("email", "Valid Email is required").isEmail(),
      check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
      check("confirmPassword", "Confirm Password is required").notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => err.msg) });
      }
  
      const { firstName, lastName, phone, email, password, confirmPassword, address, role } = req.body;
  
      // Validate if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email is already in use" });
        }
  
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user
        const newUser = new User({
          firstName,
          lastName,
          phone,
          email,
          password: hashedPassword,
          role,
          address,
          createAt: new Date().toISOString(),
        });
  
        // Save the new user to the database
        await newUser.save();
  
        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  
        // Respond with success
        return res.status(201).json({
          message: "Registration successful",
          token, // Sending token in the response body
        });
      } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Something went wrong, please try again." });
      }
    }
  );
  
  router.get("/hello", (req, res) => {
    return res.status(200).send("Hello, World!");
});

// Login user endpoint
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Compare password with hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      // Set JWT token as an HttpOnly cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only true in production for HTTPS
        maxAge: 86400000, // 1 day in milliseconds
      });

      // Respond with user data (without password)
      res.status(200).json({ userId: user.id, isAdmin: user.isAdmin });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Token validation endpoint
router.get("/auth/validate-token", verifyToken, (req, res) => {
  // Decode the token and send user info
  const token = req.cookies["auth_token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  res.status(200).json({
    userId: req.userId,
    isAdmin: decoded.isAdmin,
    token,
  });
});

// Logout user endpoint
router.post("/logout", (req, res) => {
  // Clear the cookie to log out
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.status(200).send();
});
// const jwt = require("jsonwebtoken");



router.get("/validate-token", validateToken, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    userId: req.user.userId,
  });
});

module.exports = router;
