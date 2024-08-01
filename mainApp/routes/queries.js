var express = require('express');
var router = express.Router();
var queries = require('../models/Queries');

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('addQueries', { title: 'Add Queries'});
});

router.post('/save', function(req, res, next){
    const queries = new queries(req.body)
    queries.save()
    res.redirect('/')
})

router.get('/edit/:_id', async function(req, res, next){
    const queries = await queries.findOne({_id: req.params._id})
    res.render('editqueries', {title: 'Edit queries', queries})
    console.log(queries)   
})

router.post('/saveEdited/:_id',async function(req, res, next){
    await queries.updateOne({_id: req.params._id}, {$set: req.body})
    // const currentIndex = db.books.getIndexes({_id: req.params._id})
    // books.splice(currentIndex,1, {...req.body, _id:req.params._id})
    res.redirect('/')
})

router.get('/delete/:_id',async function(req, res, next){
    const result = await queries.deleteOne({_id: req.params._id})
    // const currentIndex = books.findIndex((book) => book._id === req.params._id)
    // books.splice(currentIndex,1)

    if (result.deletedCount === 1) {
        console.log("Successfully deleted one queries.");
      } else {
        console.log("No documents matched the queries. Deleted 0 queries.");
      }

    res.redirect('/')
})

module.exports = router;