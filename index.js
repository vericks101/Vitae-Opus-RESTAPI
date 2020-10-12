const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

// Import Routes
const authRoute = require('./routes/auth');
const tagRoute = require('./routes/tag');
const projectRoute = require('./routes/project');
const forgotRoute = require('./routes/forgotUsernameOrPassword');
const resetRoute = require('./routes/resetPassword');
const resetViaUsername = require('./routes/resetPasswordViaUsername');
const verifyEmail = require('./routes/verifyEmail');
const profileRoute = require('./routes/profile');

dotenv.config();

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to the database.')
);

// Middlewares
app.use(cors());
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/tag', tagRoute);
app.use('/api/project', projectRoute);
app.use('/api/forgotusernameorpassword', forgotRoute);
app.use('/api/reset', resetRoute);
app.use('/api/resetPasswordViaUsername', resetViaUsername);
app.use('/api/verify', verifyEmail);
app.use('/api/profile', profileRoute);

// Listen on given port
const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Server is up and running on port ' + port + '.'));