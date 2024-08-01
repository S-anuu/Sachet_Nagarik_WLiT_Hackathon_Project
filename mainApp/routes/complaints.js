var express = require('express');
var router = express.Router();
const complaints = require('../models/Complaints');

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('addComplaints', { title: 'Add Complaints'});
});

router.post('/save', function(req, res, next){
    const complaint = new complaints(req.body)
    complaint.save()
    res.redirect('/')
})

router.get('/edit/:_id', async function(req, res, next){
    const complaint = await Complaints.findOne({_id: req.params._id})
    res.render('editComplaints', {title: 'Edit Complaints', complaint})
    console.log(complaint)   
})

router.post('/saveEdited/:_id',async function(req, res, next){
    await complaints.updateOne({_id: req.params._id}, {$set: req.body})
    // const currentIndex = db.books.getIndexes({_id: req.params._id})
    // books.splice(currentIndex,1, {...req.body, _id:req.params._id})
    res.redirect('/')
})

router.get('/delete/:_id',async function(req, res, next){
    const result = await complaints.deleteOne({_id: req.params._id})
    // const currentIndex = books.findIndex((book) => book._id === req.params._id)
    // books.splice(currentIndex,1)

    if (result.deletedCount === 1) {
        console.log("Successfully deleted one complaint.");
      } else {
        console.log("No documents matched the query. Deleted 0 complaints.");
      }

    res.redirect('/')
})

module.exports = router;
