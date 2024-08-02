// models/Petition.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petitionSchema = new Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    postedBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    supportCount: { type: Number, default: 0 },
    opposeCount: { type: Number, default: 0 },
    category: { type: String, required: true } // Add this field
});

module.exports = mongoose.model('Petition', petitionSchema);
