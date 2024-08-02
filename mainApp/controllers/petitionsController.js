const Petition = require('../models/Petition');
const path = require('path');
const fs = require('fs')

// Function to get all petitions
exports.getAllPetitions = async (req, res) => {
    try {
        const petitions = await Petition.find();
        res.render('petitions', { petitions });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Function to render the add petition page
exports.getAddPetitionPage = (req, res) => {
    res.render('addPetitions', {title:"Add Petitions"});
};

// Function to handle adding a new petition
exports.addPetition = async (req, res) => {
    try {
        const { title, description, subTitle } = req.body;
        let imagePath = '';
        
        // Handle file upload
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
            image = req.file.filename
        }
        else{
            image = imagePath
        }

        const newPetition = new Petition({
            title,
            subTitle,
            description,
            imageUrl: image
        });
        console.log(newPetition)
        await newPetition.save();
        res.redirect('/petitions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get All Petitions
exports.getAllPetitions = async (req, res) => {
    try {
        const petitions = await Petition.find();
        res.render('petitions', { petitions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Function to handle supporting a petition
exports.supportPetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        await Petition.findByIdAndUpdate(petitionId, { $inc: { supporters: 1 } });
        res.redirect('/petitions');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Function to handle opposing a petition
exports.opposePetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        await Petition.findByIdAndUpdate(petitionId, { $inc: { opposers: 1 } });
        res.redirect('/petitions');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.addComment = async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) {
            return res.status(404).json({ success: false, message: 'Petition not found' });
        }

        const newComment = {
            author: req.user ? req.user.username : 'Anonymous',
            text: req.body.text
        };

        petition.comments.push(newComment);
        await petition.save();

        res.json({ success: true, comment: newComment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};