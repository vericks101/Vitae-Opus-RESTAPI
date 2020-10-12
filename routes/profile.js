const User = require('../models/User');
const router = require('express').Router();

// Get User
router.post('/getUser', async (req, res) => {
    // Find a user with the associated username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            res.send(user);
        }
    });
});

// Edit User
router.put('/editUser', async (req, res) => {
    // Edit a user associated with the provided username.
    User.findOneAndUpdate({
        username: req.body.username,
    },
    {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }).then(user => {
        res.send(user._id);
    });
});

module.exports = router;