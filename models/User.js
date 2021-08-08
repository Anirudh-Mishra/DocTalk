const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;