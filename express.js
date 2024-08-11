// express.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const path = require('path');
const jobRoutes = require('./routes/jobs');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const dashboardRoutes = require('./routes/dashboard');
const app = express();
const session = require('express-session');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

app.use(express.json());
app.use(cookieParser());

// Set up session middleware
app.use(session({
  secret: 'henryjobapp', // Replace with a secure secret key
  resave: false,
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: { secure: false } // Set 'secure: true' if using HTTPS
}));


// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Root route: Redirect based on authentication status
app.get('/', (req, res) => {
  console.log('Root route accessed');
  console.log('Session data:', req.session);

  if (req.session && req.session.user) {
    // If authenticated, redirect to dashboard
    console.log('User is authenticated, redirecting to /dashboard');
    res.redirect('/dashboard');
  } else {
    // If not authenticated, redirect to login
    console.log('User is not authenticated, redirecting to /login');
    res.redirect('/login');
  }
});




mongoose.connect(process.env.MONGO_URI);


// Home route to render home.ejs
// app.get('/', (req, res) => {
//   res.render('dashboard');
// });

app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Auth routes
app.use('/', authRoutes);

// Job routes
app.use('/jobs', jobRoutes); // Use the job routes

app.get('/jobs/add-job', (req, res) => {
  if (req.session.user) {
    res.render('add-job', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.use('/', require('./routes/dashboard')); // Dashboard-related routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

