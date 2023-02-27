const mongoose = require('mongoose');
const { Schema } = mongoose;

const gamesSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url: String,
    hours: String,
    img: String,
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('gamesSchema', gamesSchema);