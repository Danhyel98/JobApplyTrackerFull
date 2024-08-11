// routes/dashboard.js
const express = require('express');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const router = express.Router();

// GET /dashboard - Render the dashboard page with jobs data
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    const jobs = await Job.find({ user: req.user.id }); // Use req.user.id to find jobs

    // Render the ejs page with the jobs data
    res.render('dashboard', { jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
