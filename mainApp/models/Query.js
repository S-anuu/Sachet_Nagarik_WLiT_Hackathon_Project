const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now }
});

const querySchema = new mongoose.Schema({
    title: String,
    description: String,
    upvotes: { type: Number, default: 0 },
    answers: [answerSchema]
});

module.exports = mongoose.model('Query', querySchema);
