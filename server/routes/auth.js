const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Field = require('../models/Field');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password, field_name, field_location, field_crops, latitude, longitude } = req.body;

        // Create user
        const user = new User({ name, email, phone, password });
        await user.save();

        // Create initial field (mandatory as per requirement)
        const cropsList = field_crops ? field_crops.split(',').map(c => c.trim()) : [];
        const field = new Field({
            user: user._id,
            name: field_name,
            location: field_location,
            crops: cropsList,
            latitude: latitude || 12.9716, // Default
            longitude: longitude || 77.5946
        });
        await field.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Get context user
router.get('/me', require('../middleware/auth'), async (req, res) => {
    res.send(req.user);
});

module.exports = router;
