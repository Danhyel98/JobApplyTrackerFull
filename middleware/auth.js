const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // Check for token in cookies
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    // Redirect to login page if no token is provided
    return res.redirect('/login');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'henryjobapp'); // Replace with your environment variable
    req.user = await User.findById(decoded.id).select('-password');
    
    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // Token is invalid or expired, redirect to login
    console.error('Invalid token:', err.message);
    res.redirect('/login');
  }
};

module.exports = auth;
