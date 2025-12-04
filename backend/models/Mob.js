const mongoose = require('mongoose');

const mobSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Passive', 'Neutral', 'Hostile', 'Boss', 'Utility']
    },
    health: {
        type: Number,
        required: true
    },
    damage: {
        type: String,
        required: true
    },
    behavior: {
        type: String,
        required: true
    },
    habitat: {
        type: String,
        required: true
    },
    drops: [{
        type: String
    }],
    rarity: {
        type: String,
        required: true,
        enum: ['Common', 'Uncommon', 'Rare', 'Legendary']
    },
    description: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    sound: {
        type: String,
        required: true
    },
    scale: {
        type: Number,
        required: true,
        default: 1.0
    },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    rotation: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    weaknesses: [{
        type: String
    }],
    abilities: [{
        type: String
    }],
    isPlayingSound: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mob', mobSchema);