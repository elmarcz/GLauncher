const mongoose = require('mongoose');
const { Schema } = mongoose;

const gShotsSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('gShotsSchema', gShotsSchema);