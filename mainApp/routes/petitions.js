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

// Fetch petition details for expanded view
router.get('/petitions/:id', async function(req, res, next) {
    try {
        const petitionId = req.params.id;
        const petition = await Petitions.findById(petitionId);

        if (!petition) {
            return res.status(404).json({ success: false, message: 'Petition not found' });
        }

        res.json({ success: true, petition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


// Route to display all petitions
router.get('/', petitionsController.getLimitedPetitions); // Adjusted to fetch limited petitions

// Route to display add petition page
router.get('/add', petitionsController.getAddPetitionPage);

// Route to handle adding a new petition
router.post('/add', upload.single('image'), petitionsController.addPetition);

// Route to handle supporting a petition
router.post('/support/:id', petitionsController.supportPetition);

// Route to handle opposing a petition
router.post('/oppose/:id', petitionsController.opposePetition);

// Route to handle adding a comment to a petition
router.post('/:id/comments', petitionsController.addComment);

module.exports = router;
