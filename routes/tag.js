const Tag = require('../models/Tag');
const User = require('../models/User');
const router = require('express').Router();

// Add Tag
router.post('/addTag', async (req, res) => {
    // Add a tag associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the tag doesn't already exist under the provided username.
            const tagExists = await Tag.findOne({
                username: req.body.username,
                name: req.body.name
            })
            if (tagExists)
                return res.status(400).send({error: 'Provided tag already exists under the provided account.'});

            // Create a new tag.
            const tag = new Tag({
                username: req.body.username,
                name: req.body.name
            });

            // Save the new tag.
            try {
                await tag.save();

                res.send({ user: user._id, tag: req.body.name });
            } catch(err) {1
                console.log(err);
                res.status(400).send(err);
            }
        }
    });
});

// Remove Tag
router.post('/removeTag', async (req, res) => {
    // Remove a tag associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the tag exists under the provided username.
            const tagExists = await Tag.findOne({
                username: req.body.username,
                name: req.body.name
            })
            if (tagExists) {
                Tag.deleteOne({ 
                    username: req.body.username,
                    name: req.body.name
                 }).then(() => {
                    res.send({ user: user._id });
                 }).catch(err => {
                    return res.status(400).send({error: err});
                 })
            } else {
                return res.status(400).send({error: 'The provided tag doesn\'t exists under the provided account.'});
            }
        }
    });
});

// Get Tags
router.post('/getTags', (req, res) => {
    // Get all tags associated with the provided user.
    Tag.find({
        username: req.body.username
    }).then(tags => {
        res.send(tags);
    }).catch(err => {
        return res.status(400).send({error: err});
    });
});

module.exports = router;