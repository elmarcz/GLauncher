const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verifyed: {
        default: false
    },
    ceo: {
        default: false
    },
    friends: [
        {
            friendID: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    img: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('userSchema', userSchema);