const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const token = req.cookies.token; // Ensure you're using cookies to retrieve the token

  // Check if token exists and is verified
  if (token) {
    jwt.verify(token, 'henryjobapp', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = { id: decodedToken.id }; // Attach user ID to req.user
        next();
      }
    });
  } else {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
};

// Check current user and attach it to res.locals
const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'henryjobapp', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { auth, checkUser };
