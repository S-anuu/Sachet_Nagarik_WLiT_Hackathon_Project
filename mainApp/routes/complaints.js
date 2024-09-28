var express = require('express');
var router = express.Router(); // Create an instance of Router
const Complaints = require('../models/Complaints');
const User = require('../models/User'); // Import the User model
const { ensureAuthenticated } = require('../middleware/auth'); // Import the authentication middleware

// Get all complaints
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaints.find(); // Fetch complaints from the database
    const user = req.user || null; // Ensure req.user is set by authentication middleware

    // Prepare supportUsers and oppositionUsers for each complaint
    const complaintsWithUsers = complaints.map(complaint => ({
        ...complaint.toObject(),
        supportUsers: complaint.supportUsers || [],
        oppositionUsers: complaint.oppositionUsers || []
    }));

    res.render('complaints', { 
        complaints: complaintsWithUsers, 
        user // Pass the user data to the EJS view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Render the form to add a new complaint
router.get('/add', ensureAuthenticated, function(req, res, next) {
  res.render('addComplaints', { title: 'Add Complaints' });
});

// Save a new complaint
router.post('/save', ensureAuthenticated, function(req, res, next) {
  const complaint = new Complaints(req.body);
  complaint.save()
    .then(() => res.redirect('/complaints'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Server Error');
    });
});

// Render the form to edit a complaint
router.get('/edit/:_id', ensureAuthenticated, async function(req, res, next) {
  try {
    const complaint = await Complaints.findOne({ _id: req.params._id });
    res.render('editComplaints', { title: 'Edit Complaints', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Save edited complaint
router.post('/saveEdited/:_id', ensureAuthenticated, async function(req, res, next) {
  try {
    await Complaints.updateOne({ _id: req.params._id }, { $set: req.body });
    res.redirect('/complaints');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a complaint
router.get('/delete/:_id', ensureAuthenticated, async function(req, res, next) {
  try {
    const result = await Complaints.deleteOne({ _id: req.params._id });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one complaint.");
    } else {
      console.log("No documents matched the query. Deleted 0 complaints.");
    }
    res.redirect('/complaints');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Support a complaint
router.post('/support/:_id', ensureAuthenticated, async (req, res, next) => {
  try {
    const complaint = await Complaints.findOne({ _id: req.params._id });

    if (complaint.supportUsers.includes(req.user._id)) {
      return res.redirect('/complaints');
    }

    if (complaint.oppositionUsers.includes(req.user._id)) {
      await Complaints.updateOne(
        { _id: req.params._id },
        { $inc: { oppositionCount: -1 }, $pull: { oppositionUsers: req.user._id } }
      );
    }

    await Complaints.updateOne(
      { _id: req.params._id },
      { $inc: { supportCount: 1 }, $addToSet: { supportUsers: req.user._id } }
    );
    res.redirect('/complaints');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Oppose a complaint
router.post('/opposition/:_id', ensureAuthenticated, async (req, res, next) => {
  try {
    const complaint = await Complaints.findOne({ _id: req.params._id });

    if (complaint.oppositionUsers.includes(req.user._id)) {
      return res.redirect('/complaints');
    }

    if (complaint.supportUsers.includes(req.user._id)) {
      await Complaints.updateOne(
        { _id: req.params._id },
        { $inc: { supportCount: -1 }, $pull: { supportUsers: req.user._id } }
      );
    }

    await Complaints.updateOne(
      { _id: req.params._id },
      { $inc: { oppositionCount: 1 }, $addToSet: { oppositionUsers: req.user._id } }
    );
    res.redirect('/complaints');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
