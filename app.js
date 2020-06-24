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

app.get(('/'), (req, res) => {
  res.json({ status: 'success', payload: 'Hello World' });
})

// ROUTES
app.use('/auth', require('./routes/authRoutes'));
app.use('/config', require('./routes/configRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/story', require('./routes/storyRoutes'));

app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = 'failure';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({ type: err.status, payload: err.message });
});

module.exports = app;