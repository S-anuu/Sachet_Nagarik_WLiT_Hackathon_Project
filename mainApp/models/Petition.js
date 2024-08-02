const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    description: String,
    imageUrl: String,
    supports: { type: Number, default: 0 },
    opposes: { type: Number, default: 0 },
    comments: [{
        author: String,
        text: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Petition', PetitionSchema);

