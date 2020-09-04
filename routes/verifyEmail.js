const User = require('../models/User');
const router = require('express').Router();

router.post('/', (req, res) => {
    // If user exists with verification token, send back validated response.
    User.findOne({
        verificationToken: req.body.verificationToken
    }).then(async user => {
        if (user === null) {
            res.status(400).send('verification link is invalid.');
        } else {
            user.verified = true;
            await user.save();

            res.status(200).send({
                username: user.username,
                message: 'verification link a-ok',
            });
        }
    });
});

module.exports = router;