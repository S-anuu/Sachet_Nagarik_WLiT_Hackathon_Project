var express = require('express');
var router = express.Router();
var Complaints = require('../models/Complaints')
var Petitions = require('../models/Petitions')
var Queries = require('../models/Queries')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const petitions = await Petitions.find()
  res.render('index', { title: 'Sachet Nagarik', petitionlist: petitions });
});

router.get('/petitions', async function(req, res, next) {
    const petitions = await Petitions.find()
    res.render('petitions', { title: 'Sachet Nagarik', petitionlist: petitions });
});

router.get('/queries', async function(req, res, next) {
    const queries = await Queries.find()
    res.render('queries', { title: 'Sachet Nagarik', querieslist: queries });
});

router.get('/complaints', async function(req, res, next) {
    const complaints = await Complaints.find()
    res.render('complaints', { title: 'Sachet Nagarik', complaintslist: complaints });
});

router.get('/about-us', function(req, res, next) {
    res.render('aboutUs');
  });

router.get('/contact-us', function(req, res, next) {
    res.render('contactUs');
  });

module.exports = router;