const express = require('express');
const router = express.Router(); // Create an instance of Router
const Queries = require('../models/Queries'); // Import the Queries model
const User = require('../models/User'); // Import the User model

// Get all queries
router.get('/queries', async (req, res) => {
  try {
    const queries = await Queries.find(); // Fetch queries from the database
    console.log('Queries fetched:', queries);
    const user = req.user || null; // Ensure req.user is set by authentication middleware

    // Prepare any additional data if needed
    const queriesWithUsers = queries.map(query => ({
        ...query.toObject(),
        // Add any additional user data if needed
    }));

    res.render('queries', { 
        queries: queriesWithUsers, 
        user // Pass the user data to the EJS view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Render the form to add a new query
router.get('/add', function(req, res, next) {
  res.render('addQueries', { title: 'Add Query' });
});

// Save a new query
router.post('/save', function(req, res, next) {
  const query = new Queries(req.body);
  query.save()
    .then(() => res.redirect('/queries'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Server Error');
    });
});

// Render the form to edit a query
router.get('/edit/:_id', async function(req, res, next) {
  try {
    const query = await Queries.findOne({ _id: req.params._id });
    res.render('editQueries', { title: 'Edit Query', query });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Save edited query
router.post('/saveEdited/:_id', async function(req, res, next) {
  try {
    await Queries.updateOne({ _id: req.params._id }, { $set: req.body });
    res.redirect('/queries');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a query
router.get('/delete/:_id', async function(req, res, next) {
  try {
    const result = await Queries.deleteOne({ _id: req.params._id });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one query.");
    } else {
      console.log("No documents matched the query. Deleted 0 queries.");
    }
    res.redirect('/queries');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Support a query
router.post('/support/:_id', async (req, res, next) => {
  try {
    const query = await Queries.findOne({ _id: req.params._id });

    if (query.supportUsers.includes(req.user._id)) {
      return res.redirect('/queries');
    }

    if (query.oppositionUsers.includes(req.user._id)) {
      await Queries.updateOne(
        { _id: req.params._id },
        { $inc: { oppositionCount: -1 }, $pull: { oppositionUsers: req.user._id } }
      );
    }

    await Queries.updateOne(
      { _id: req.params._id },
      { $inc: { supportCount: 1 }, $addToSet: { supportUsers: req.user._id } }
    );
    res.redirect('/queries');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Oppose a query
router.post('/opposition/:_id', async (req, res, next) => {
  try {
    const query = await Queries.findOne({ _id: req.params._id });

    if (query.oppositionUsers.includes(req.user._id)) {
      return res.redirect('/queries');
    }

    if (query.supportUsers.includes(req.user._id)) {
      await Queries.updateOne(
        { _id: req.params._id },
        { $inc: { supportCount: -1 }, $pull: { supportUsers: req.user._id } }
      );
    }

    await Queries.updateOne(
      { _id: req.params._id },
      { $inc: { oppositionCount: 1 }, $addToSet: { oppositionUsers: req.user._id } }
    );
    res.redirect('/queries');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
