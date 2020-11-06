const User = require('../models/User');
const Experience = require('../models/Experience');
const router = require('express').Router();

// Add Experience
router.post('/addExperience', async (req, res) => {
    // Add a experience associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the experience doesn't already exist under the provided username.
            const experienceExists = await Experience.findOne({
                username: req.body.username,
                title: req.body.title
            })
            if (experienceExists)
                return res.status(400).send({error: 'Provided experience already exists under the provided account.'});

            // Create a new experience.
            const experience = new Experience({
                username: req.body.username,
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags
            });

            // Save the new experience.
            try {
                await experience.save();

                res.send({ user: user._id, experience: req.body.title });
            } catch(err) {1
                console.log(err);
                res.status(400).send(err);
            }
        }
    });
});

// Edit Experience
router.put('/editExperience', async (req, res) => {
    // Edit a experience associated with the provided username and title.
    Experience.findOneAndUpdate({
        username: req.body.username,
        title: req.body.title
    },  
    {
        title: req.body.updatedTitle,
        description: req.body.updatedDescription,
        tags: req.body.updatedTags
    }).then(async () => {
        Experience.findOne({
            username: req.body.username,
            title: req.body.updatedTitle
        }).then(experience => {
            experience.oldTitle = req.body.title;
            res.send(experience);
        }).catch(err => {
            return res.status(400).send({error: err});
        });
    }); 
});

// Remove Experience
router.post('/removeExperience', async (req, res) => {
    // Remove a experience associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the experience exists under the provided username.
            const experienceExists = await Experience.findOne({
                username: req.body.username,
                title: req.body.title
            })
            if (experienceExists) {
                Experience.deleteOne({ 
                    username: req.body.username,
                    title: req.body.title
                 }).then(() => {
                    res.send({ user: user._id });
                 }).catch(err => {
                    return res.status(400).send({error: err});
                 })
            } else {
                return res.status(400).send({error: 'The provided experience doesn\'t exists under the provided account.'});
            }
        }
    });
});

// Get Experiences
router.post('/getExperiences', (req, res) => {
    // Get all experiences associated with the provided user.
    Experience.find({
        username: req.body.username
    }).then(experiences => {
        res.send(experiences);
    }).catch(err => {
        return res.status(400).send({error: err});
    });
});

module.exports = router;