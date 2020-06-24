const app = require('./app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MONGO CONNECTION
const DB_CONNECTION = process.env.APP_DB || 'DUMMY_DATA';
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});