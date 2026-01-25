const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Field = require('../models/Field');
const { sendOTP } = require('../services/emailService');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password, field_name, field_location, field_crops, latitude, longitude } = req.body;

        // Create user with OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = new User({
            name,
            email,
            phone,
            password,
            otp,
            otpExpires
        });
        await user.save();

        // Send OTP email
        await sendOTP(email, otp);

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

        if (!user.isVerified) {
            return res.status(403).send({ error: 'Please verify your email first', email: user.email });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send({ error: 'User not found' });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).send({ error: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token, message: 'Email verified successfully' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send({ error: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp);
        res.send({ message: 'OTP resent successfully' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send({ error: 'No account found with this email' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp);
        res.send({ message: 'Password reset OTP sent to your email' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send({ error: 'User not found' });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).send({ error: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true; // Auto-verify if they reset password
        await user.save();

        res.send({ message: 'Password reset successfully' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Get context user
router.get('/me', require('../middleware/auth'), async (req, res) => {
    res.send(req.user);
});

module.exports = router;
