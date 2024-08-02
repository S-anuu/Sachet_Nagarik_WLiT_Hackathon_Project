var express = require('express');
var router = express.Router();
var petitions = require('../models/Petitions');


router.get('/add', function(req, res, next) {
  res.render('addPetitions', { title: 'Add petitions'});
});

router.post('/save', function(req, res, next){
    const petition = new petitions(req.body)
    petition.save()
    res.redirect('/')
})

router.get('/edit/:_id', async function(req, res, next){
    const petition = await petitions.findOne({_id: req.params._id})
    res.render('editpetitions', {title: 'Edit Petitions', petition})
    console.log(petition)   
})

router.post('/saveEdited/:_id',async function(req, res, next){
    await petitions.updateOne({_id: req.params._id}, {$set: req.body})
    // const currentIndex = db.books.getIndexes({_id: req.params._id})
    // books.splice(currentIndex,1, {...req.body, _id:req.params._id})
    res.redirect('/')
})

router.get('/delete/:_id',async function(req, res, next){
    const result = await petitions.deleteOne({_id: req.params._id})
    // const currentIndex = books.findIndex((book) => book._id === req.params._id)
    // books.splice(currentIndex,1)

    if (result.deletedCount === 1) {
        console.log("Successfully deleted one petition.");
      } else {
        console.log("No documents matched the query. Deleted 0 petitions.");
      }

    res.redirect('/')
})

module.exports = router;