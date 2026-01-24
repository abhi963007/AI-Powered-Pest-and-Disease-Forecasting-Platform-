const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

// Get localized active alerts (within 10km radius)
router.get('/', auth, async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let query = { isActive: true };

        if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            console.log(`[ALERTS] No valid location provided for ${req.user.name}. Returning zero alerts as requested.`);
            return res.send([]);
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        console.log(`[ALERTS] Querying for ${req.user.name} @ [${latitude}, ${longitude}]`);

        // 10km in radians = 10 / 6371 (Earth radius)
        const radiusInRadians = 10 / 6371;

        const alerts = await Alert.find({
            isActive: true,
            $or: [
                { reportedBy: req.user._id },
                {
                    coordinates: {
                        $geoWithin: {
                            $centerSphere: [[longitude, latitude], radiusInRadians]
                        }
                    }
                }
            ]
        }).sort({ createdAt: -1 });

        console.log(`[ALERTS] Found ${alerts.length} alerts for this session.`);
        res.send(alerts);
    } catch (e) {
        console.error('Fetch localized alerts error:', e);
        res.status(500).send({ error: 'Failed to fetch localized alerts' });
    }
});

// Create alert
router.post('/', auth, async (req, res) => {
    try {
        console.log('Incoming Alert Report:', req.body);
        const { pestType, description, location, riskLevel, coordinates, longitude, latitude } = req.body;

        let coords = [77.5946, 12.9716]; // Default
        if (coordinates && coordinates.coordinates) {
            coords = coordinates.coordinates;
        } else if (longitude && latitude) {
            coords = [parseFloat(longitude), parseFloat(latitude)];
        }

        const alert = new Alert({
            reportedBy: req.user._id,
            pestType,
            description,
            location,
            riskLevel: riskLevel || 'low',
            coordinates: { type: 'Point', coordinates: coords }
        });
        await alert.save();
        res.status(201).send(alert);
    } catch (e) {
        console.error('Alert Submission Error:', e);
        res.status(400).send(e.message);
    }
});

// Update alert (Only by owner)
router.put('/:id', auth, async (req, res) => {
    try {
        const { pestType, description, riskLevel } = req.body;
        const alert = await Alert.findOneAndUpdate(
            { _id: req.params.id, reportedBy: req.user._id },
            { pestType, description, riskLevel },
            { new: true }
        );
        if (!alert) return res.status(404).send({ error: 'Alert not found or unauthorized' });
        res.send(alert);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Delete alert (Only by owner)
router.delete('/:id', auth, async (req, res) => {
    try {
        const alert = await Alert.findOneAndDelete({ _id: req.params.id, reportedBy: req.user._id });
        if (!alert) return res.status(404).send({ error: 'Alert not found or unauthorized' });
        res.send({ message: 'Alert deleted successfully' });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
