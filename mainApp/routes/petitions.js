const express = require('express');
const router = express.Router();
const Petition = require('../models/Petitions');

// Route to display all petitions
router.get('/', async (req, res, next) => {
    try {
        const petitions = await Petition.find();
        res.render('petitions', { title: 'Petitions', petitions });
    } catch (err) {
        next(err);
    }
});

// Route to display petitions by category
router.get('/category/:category', async (req, res, next) => {
    try {
        const category = req.params.category;
        const petitions = await Petition.find({ category }); // Assuming the category field exists in your model
        res.render('petitions', { title: 'Petitions', petitions, category });
    } catch (err) {
        next(err);
    }
});

// Route to support a petition
router.post('/support/:id', async (req, res, next) => {
    try {
        await Petition.findByIdAndUpdate(req.params.id, { $inc: { supportCount: 1 } });
        res.redirect('back'); // Redirect back to the previous page
    } catch (err) {
        next(err);
    }
});

// Route to oppose a petition
router.post('/oppose/:id', async (req, res, next) => {
    try {
        await Petition.findByIdAndUpdate(req.params.id, { $inc: { opposeCount: 1 } });
        res.redirect('back'); // Redirect back to the previous page
    } catch (err) {
        next(err);
    }
});

module.exports = router;
