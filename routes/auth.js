const router = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Register user.
router.post('/register', async (req, res) => {
    // Validate data before we create a user.
    const {error} = registerValidation(req.body);
    if (error) 
        return res.status(400).send(error.details[0].message);

    // Check if user is already in the database.
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
        return res.status(400).send({error: 'An account with this email already exists.'});
    const usernameExists = await User.findOne({username: req.body.username});
    if (usernameExists)
        return res.status(400).send({error: 'An account with this username already exists.'});

    // Hash the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a verification token.
    const token = crypto.randomBytes(20).toString('hex');

    // Create a new user.
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        verificationToken: token,
    });

    // Save the new user.
    try {
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        });

        const mailOptions = {
            from: 'noreplyvitaeopus@gmail.com',
            to: `${user.email}`,
            subject: 'Link to Verify Email',
            text:
                'You are receiving this because you have registered a new Vitae Opus account under this email.\n\n'
                + 'Please click on the following link, or paste this into your browser to verify your account:\n\n'
                + `http://localhost:4200/verify/${token}\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json('verification email sent.');
            }
        });

        res.send({ user: user._id });
    } catch(err) {1
        console.log(err);
        res.status(400).send(err);
    }
});

// Login user.
router.post('/login', async (req, res) => {
    // Validate data before we login a user.
    const {error} = loginValidation(req.body);
    if (error) 
        return res.status(400).send(error.details[0].message);

    // Check if user exists.
    const user = await User.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).send({error: 'Username or password does not match any existing records.'});

    // Check if user has verified their email.
    if (!user.verified)
        return res.status(400).send({error: 'This user has not verified the email provided yet.'});
    
    // Check if password is correct.
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send({error: 'Username or password does not match any existing records.'});

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token: token, username: user.username});
});

module.exports = router;