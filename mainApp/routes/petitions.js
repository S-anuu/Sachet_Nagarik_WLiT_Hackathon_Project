const express = require('express');
const router = express.Router();
const petitionsController = require('../controllers/petitionsController');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route to display all petitions
router.get('/', petitionsController.getAllPetitions);

// Route to display add petition page
router.get('/add', petitionsController.getAddPetitionPage);

// Route to handle adding a new petition
router.post('/add', upload.single('image'), petitionsController.addPetition);

// Route to handle supporting a petition
router.post('/support/:id', petitionsController.supportPetition);

// Route to handle opposing a petition
router.post('/oppose/:id', petitionsController.opposePetition);

// Route to handle adding a new petition with image upload
// router.post('/add', upload.single('image'), petitionsController.addPetition);

// Route to handle adding a comment to a petition
router.post('/:id/comments', petitionsController.addComment);

module.exports = router;
