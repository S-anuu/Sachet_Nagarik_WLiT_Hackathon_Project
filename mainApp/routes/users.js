const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth'); // Import the middleware if needed

// Route for rendering the login page
router.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login', 
    message: req.flash('error') // If using flash messages for login errors
  });
});

// Route for handling login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // Redirect to home or dashboard on success
  failureRedirect: '/users/login', // Redirect back to login page on failure
  failureFlash: true // Enable flash messages on failure
}));

// Route for rendering the registration page
router.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Register' 
  });
});

// Route for handling registration form submission
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Create a new user
    const newUser = new User({ username, password, email });

    // Save the user to the database
    await newUser.save();

    // Redirect to login page with a success message
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Registration failed.');
    res.redirect('/users/register');
  }
});

// Route for logging out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out.');
  res.redirect('/');
});

// Route for user profile (example, should be protected)
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { 
    title: 'Profile', 
    user: req.user // Pass the user data to the view
  });
});

module.exports = router;
