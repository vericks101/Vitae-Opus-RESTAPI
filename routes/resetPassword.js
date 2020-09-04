const User = require('../models/User');
const router = require('express').Router();

router.post('/', (req, res) => {
    // If user exists with reset token, send back validated response.
    User.findOne({
        resetPasswordToken: req.body.resetPasswordToken
    }).then(user => {
        if (user === null || new Date(user.resetPasswordExpires) < new Date()) {
            res.status(400).send('password reset link is invalid or has expired.');
        } else {
            res.status(200).send({
                username: user.username,
                message: 'password reset link a-ok',
            });
        }
    });
});

module.exports = router;