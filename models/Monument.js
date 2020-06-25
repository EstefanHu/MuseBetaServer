const mongoose = require('mongoose');
const { Scheme } = mongoose;
const slugify = require('slugify');
const { schema } = require('./User');

const monumentSchema = new schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Momument must be named'],
    default: ''
  },
  spirit: {
    type: String,
    trim: true,
    required: [true, 'Every monument must have a spirit']
  },
  longitude: {
    type: Number,
    trim: true,
    required: true
  },
  latitude: {
    type: Number,
    trim: true,
    required: true
  },
  slug: String,
  photo: String,
  feed: {
    type: [String],
  }
});

monumentSchema.pre('save', function (next) {
  this.slug =
    slugify(this.author + ' ' + this.title, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
    });
  next();
});

module.exports = mongoose.model('Monument', monumentSchema);