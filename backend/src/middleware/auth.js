const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.JWT_SECRET_KEY

// Middleware to verify the JWT token
// const jwt = require("jsonwebtoken");

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

module.exports = verifyToken;
