const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Field = require('../models/Field');

// Get all fields for user
router.get('/', auth, async (req, res) => {
    try {
        const fields = await Field.find({ user: req.user._id });
        res.send(fields);
    } catch (e) {
        res.status(500).send();
    }
});

// Add new field
router.post('/', auth, async (req, res) => {
    try {
        const field = new Field({
            ...req.body,
            user: req.user._id
        });
        await field.save();
        res.status(201).send(field);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Delete field
router.delete('/:id', auth, async (req, res) => {
    try {
        const field = await Field.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!field) return res.status(404).send();
        res.send(field);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
