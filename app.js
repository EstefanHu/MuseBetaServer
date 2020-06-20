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

// SESSIONS WITH REDIS
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
const sessionStore = new RedisStore({
  host: 'localhost',
  port: 6379,
  client: redisClient,
  ttl: 260
});
app.use(session({
  secret: process.env.SESSIONS_KEY || 'super-secret-sessions',
  store: sessionStore,
  saveUninitialized: false,
  resave: false,
  name: 'museCookie',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: false,
    sameSite: false,
    secure: process.env.ENVIRONMENT === 'production'
  }
}));

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
app.use('/mobile', require('./routes/mobileRoutes'));

module.exports = app;