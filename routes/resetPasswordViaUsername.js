const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

router.post('/', (req, res) => {
    // If user exists, change their password.
    User.findOne({ 
        username: req.body.username 
    }).then(async (user) => {
        if (user === null) {
            res.status(403).send('user not in db.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            user.password = hashedPassword;
            await user.save();

            res.status(200).send({
                message: 'password was reset.',
            });
        }
    });
});

module.exports = router;