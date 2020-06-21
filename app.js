const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// MODEL IMPORTS
require('./models/User');
require('./models/Story');

// MONGO CONNECTION
const DB_CONNECTION = process.env.APP_DB || 'muse_beta';
mongoose.connect(`mongodb://localhost/${DB_CONNECTION}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
mongoose.connection.once('open', () => {
  console.log(`connection has been established to ${DB_CONNECTION}`);
}).on('err', err => {
  console.log('Connection Error: ' + err);
});

// MIDDLEWARE
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.json({ msg: 'hello wolrd' });
})

// ROUTES
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/story', require('./routes/storyRoutes'));

module.exports = app;