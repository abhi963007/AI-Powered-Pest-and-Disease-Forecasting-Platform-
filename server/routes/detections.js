const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const auth = require('../middleware/auth');
const Detection = require('../models/Detection');
const Alert = require('../models/Alert');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/detections';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Create detection
router.post('/detect', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send({ error: 'Please upload an image' });

        // Call Python AI Service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, formData, {
            headers: formData.getHeaders()
        });

        const result = aiResponse.data;

        // Save to MongoDB
        const detection = new Detection({
            user: req.user._id,
            imagePath: req.file.path,
            diseaseName: result.disease_name,
            isHealthy: result.is_healthy,
            confidence: result.confidence,
            description: result.description,
            prevention: result.prevention,
            supplementName: result.supplement?.name,
            supplementImage: result.supplement?.image,
            supplementLink: result.supplement?.link
        });

        await detection.save();
        res.send(detection);
    } catch (e) {
        console.error('Detection error:', e);
        res.status(500).send({ error: 'AI analysis failed' });
    }
});

// Get detection history
router.get('/history', auth, async (req, res) => {
    try {
        const detections = await Detection.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.send(detections);
    } catch (e) {
        res.status(500).send();
    }
});

// Delete detection record
router.delete('/history/:id', auth, async (req, res) => {
    try {
        const detection = await Detection.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!detection) return res.status(404).send({ error: 'Record not found' });

        // Optionally delete the image file from disk
        if (detection.imagePath && fs.existsSync(detection.imagePath)) {
            try {
                fs.unlinkSync(detection.imagePath);
            } catch (err) {
                console.error('Failed to delete image file:', err);
            }
        }

        res.send(detection);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server Error' });
    }
});

module.exports = router;
