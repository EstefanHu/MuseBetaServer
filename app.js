const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// MODEL IMPORTS
require('./models/User');
require('./models/Story');

// MIDDLEWARE
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors('*'));

// ROUTES
app.use('/auth', require('./routes/authRoutes'));
app.use('/config', require('./routes/configRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/story', require('./routes/storyRoutes'));

module.exports = app;