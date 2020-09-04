const mongoose = require('mongoose');

// Mongoose schema used to define a user.
const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    username: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    verificationToken: {
        type: String,
        required: false,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);