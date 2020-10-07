const User = require('../models/User');
const Project = require('../models/Project');
const router = require('express').Router();

// Add Project
router.post('/addProject', async (req, res) => {
    // Add a project associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the project doesn't already exist under the provided username.
            const projectExists = await Project.findOne({
                username: req.body.username,
                title: req.body.title
            })
            if (projectExists)
                return res.status(400).send({error: 'Provided project already exists under the provided account.'});

            // Create a new project.
            const project = new Project({
                username: req.body.username,
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags
            });

            // Save the new project.
            try {
                await project.save();

                res.send({ user: user._id, project: req.body.title });
            } catch(err) {1
                console.log(err);
                res.status(400).send(err);
            }
        }
    });
});

// Edit Project
router.put('/editProject', async (req, res) => {
    // Edit a project associated with the provided username and title.
    Project.findOneAndUpdate({
        username: req.body.username,
        title: req.body.title
    },  
    {
        title: req.body.updatedTitle,
        description: req.body.updatedDescription,
        tags: req.body.updatedTags
    }).then(async () => {
        Project.findOne({
            username: req.body.username,
            title: req.body.updatedTitle
        }).then(project => {
            project.oldTitle = req.body.title;
            res.send(project);
        }).catch(err => {
            return res.status(400).send({error: err});
        });
    }); 
});

// Remove Project
router.post('/removeProject', async (req, res) => {
    // Remove a project associated with the provided username.
    User.findOne({
        username: req.body.username
    }).then(async user => {
        if (user === null) {
            res.status(400).send('user not found.');
        } else {
            // Ensure the project exists under the provided username.
            const projectExists = await Project.findOne({
                username: req.body.username,
                title: req.body.title
            })
            if (projectExists) {
                Project.deleteOne({ 
                    username: req.body.username,
                    title: req.body.title
                 }).then(() => {
                    res.send({ user: user._id });
                 }).catch(err => {
                    return res.status(400).send({error: err});
                 })
            } else {
                return res.status(400).send({error: 'The provided project doesn\'t exists under the provided account.'});
            }
        }
    });
});

// Get Projects
router.post('/getProjects', (req, res) => {
    // Get all projects associated with the provided user.
    Project.find({
        username: req.body.username
    }).then(projects => {
        res.send(projects);
    }).catch(err => {
        return res.status(400).send({error: err});
    });
});

module.exports = router;