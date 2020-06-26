const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const app = express();

// MIDDLEWARE
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, try again in one hour.'
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded());
app.use(cors('*'));
app.use(mongoSanitize());
app.use(xss());
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