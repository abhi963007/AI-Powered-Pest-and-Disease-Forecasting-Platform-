const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pestType: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    reportCount: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
