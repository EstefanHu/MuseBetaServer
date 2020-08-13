const app = require('./app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', error => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config();

// MONGO CONNECTION
const DB_CONNECTION = process.env.APP_DB || 'DUMMY_DATA';
mongoose.connect(process.env.NODE_ENV === 'production' ?
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds139884.mlab.com:39884/heroku_f4j7j018`
  : `mongodb://localhost/${DB_CONNECTION}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
mongoose.connection.once('open', () => {
  console.log(`connection has been established to ${DB_CONNECTION}`);
}).on('err', error => {
  console.error('Connection Error: ' + error);
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('unhandledRejection', error => {
  console.error(error.name, error.message);
  console.log('UNHANDLED REJECTION: Shutting down...');
  server.close(() => process.exit(1));
});