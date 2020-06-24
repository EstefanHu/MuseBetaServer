const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const app = express();

// MODEL IMPORTS
require('./models/User');
require('./models/Story');

// MIDDLEWARE
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors('*'));

app.get(('/'), (req, res) => {
  res.json({ status: 'success', payload: 'Hello World' });
})

// ROUTES
app.use('/auth', require('./routes/authRoutes'));
app.use('/config', require('./routes/configRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/story', require('./routes/storyRoutes'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;