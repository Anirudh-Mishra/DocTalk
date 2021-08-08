const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    yoexp: {
        type: Number,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Doctor'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;