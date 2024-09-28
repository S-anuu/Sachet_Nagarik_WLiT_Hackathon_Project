const Query = require('../models/Query'); // Your Query model

// Fetch all queries and render the queries view
exports.getAllQueries = async (req, res) => {
    try {
        const queries = await Query.find(); // Fetch queries from the database
        res.render('queries', { title: 'Query Forum', querieslist: queries }); // Ensure 'title' and 'querieslist' match your EJS expectations
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle upvoting a query
exports.upvoteQuery = async (req, res) => {
    try {
        await Query.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } });
        res.redirect('/queries');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle submitting an answer to a query
exports.submitAnswer = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) {
            return res.status(404).send('Query not found');
        }
        query.answers.push({ text: req.body.answer, date: new Date() });
        await query.save();
        res.redirect('/queries');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle adding a new query
exports.addQuery = async (req, res) => {
    try {
        const newQuery = new Query({
            title: req.body.title,
            description: req.body.description,
            upvotes: 0,
            answers: []
        });
        await newQuery.save();
        res.redirect('/queries');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
