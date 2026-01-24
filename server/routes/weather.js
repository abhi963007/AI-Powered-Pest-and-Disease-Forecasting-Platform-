const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Field = require('../models/Field');
const { getWeatherData, calculateDiseaseRisk } = require('../services/weatherService');

router.get('/:fieldId/forecast', auth, async (req, res) => {
    try {
        const field = await Field.findOne({ _id: req.params.fieldId, user: req.user._id });
        if (!field) return res.status(404).send({ error: 'Field not found' });

        console.log(`Fetching weather for field: ${field.name} at [${field.latitude}, ${field.longitude}]`);
        const weather = await getWeatherData(field.latitude, field.longitude, process.env.OPENWEATHER_API_KEY);

        if (!weather || weather.description === "Demo Mode") {
            console.warn("Weather data returned demo mode or null. Check API Key.");
        }

        const risks = calculateDiseaseRisk(weather, field.crops);
        res.send({ weather, risks });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
