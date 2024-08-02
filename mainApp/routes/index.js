var express = require('express');
var router = express.Router();
var Complaints = require('../models/Complaints');
var Petitions = require('../models/Petition');
var Queries = require('../models/Query');

router.get('/', async function(req, res, next) {
    try {
        const limit = 2; // Limit to 2 petitions
        const petitions = await Petitions.find().limit(limit);
        console.log("this is petitionlist", petitions);
        res.render('index', { petitionlist: petitions }); // Pass petitionlist to index.ejs
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/queries', async function(req, res, next) {
    try {
        const queries = await Queries.find();
        res.render('queries', { title: 'Sachet Nagarik', querieslist: queries });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaints.find(); // Fetch complaints from the database
        res.render('complaints', { complaints }); // Pass complaints to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/about-us', function(req, res, next) {
    res.render('aboutUs');
});

router.get('/contact-us', function(req, res, next) {
    res.render('contactUs');
});

module.exports = router;
