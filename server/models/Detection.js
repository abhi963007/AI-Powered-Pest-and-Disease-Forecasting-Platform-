const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    diseaseName: { type: String, required: true },
    isHealthy: { type: Boolean, required: true },
    confidence: { type: Number },
    description: { type: String },
    prevention: { type: String },
    supplementName: { type: String },
    supplementImage: { type: String },
    supplementLink: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Detection', detectionSchema);
