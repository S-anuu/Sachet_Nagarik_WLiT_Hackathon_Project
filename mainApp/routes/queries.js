const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Route to view queries
router.get('/queries', queryController.getAllQueries);

// Route to upvote a query
router.post('/:id/upvote', queryController.upvoteQuery);

// Route to submit an answer
router.post('/:id/answers', queryController.submitAnswer);

// Route to add a new query
router.post('/', queryController.addQuery);

module.exports = router;

