const mongoose = require('mongoose');

// Mongoose schema used to define a project.
const projectSchema = new mongoose.Schema( {
    username: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    oldTitle: {
        type: String
    },
    creation_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Project', projectSchema);