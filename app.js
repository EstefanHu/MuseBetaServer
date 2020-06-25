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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors('*'));

app.get(('/'), (req, res) => {
  res.json({ status: 'success', payload: 'Hello World' });
})

// ROUTES
app.use('/api/v1/config', require('./routes/configRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/story', require('./routes/storyRoutes'));
app.use('/api/v1/monument', require('./routes/monumentRoute'));
app.use('/api/v1/chapter', require('./routes/chapterRoutes'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;