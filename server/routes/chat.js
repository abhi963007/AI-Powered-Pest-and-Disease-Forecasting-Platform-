const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAIChatResponse } = require('../services/chatService');

router.post('/:detectionId', auth, async (req, res) => {
    try {
        const { message, history, diseaseName } = req.body;
        const response = await getAIChatResponse(message, diseaseName, history);
        res.send({ response });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
