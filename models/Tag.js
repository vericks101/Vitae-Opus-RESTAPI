const mongoose = require('mongoose');

// Mongoose schema used to define a user.
const tagSchema = new mongoose.Schema( {
    username: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    creation_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Tag', tagSchema);