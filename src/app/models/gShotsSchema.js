const mongoose = require('mongoose');
const { Schema } = mongoose;

const gShotsSchema = new Schema({
    userID: String,
    img: String,
    name: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GShotSchema', gShotsSchema);