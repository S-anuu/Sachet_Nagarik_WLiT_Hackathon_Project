const Petition = require('../models/Petition');
const path = require('path');
const fs = require('fs');

exports.getAllPetitions = async (req, res) => {
    try {
        const petitions = await Petition.find();
        res.render('petitions', { petitions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAddPetitionPage = (req, res) => {
    res.render('addPetitions', { title: "Add Petitions" });
};

exports.addPetition = async (req, res) => {
    try {
        const { title, description, subTitle } = req.body;
        let imagePath = '';
        
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const newPetition = new Petition({
            title,
            subtitle: subTitle, // Ensure field names match
            description,
            imageUrl: imagePath
        });

        await newPetition.save();
        res.redirect('/petitions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.supportPetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        await Petition.findByIdAndUpdate(petitionId, { $inc: { supports: 1 } });
        res.json({ success: true, newSupportCount: (await Petition.findById(petitionId)).supports });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.opposePetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        await Petition.findByIdAndUpdate(petitionId, { $inc: { opposes: 1 } });
        res.json({ success: true, newOpposeCount: (await Petition.findById(petitionId)).opposes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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

// Function to get limited petitions
exports.getLimitedPetitions = async (req, res) => {
    try {
        // Fetch only 2 petitions
        const petitions = await Petition.find().limit(2);
        res.render('petitions', { petitionlist: petitions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
