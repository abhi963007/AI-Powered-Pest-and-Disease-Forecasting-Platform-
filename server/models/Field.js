const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    crops: [{ type: String }],
    latitude: { type: Number },
    longitude: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Field', fieldSchema);
