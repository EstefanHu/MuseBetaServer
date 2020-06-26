const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const storySchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Story must have a title'],
    default: ''
  },
  genre: {
    type: String,
    required: [true, 'Story must have a genre'],
    enum: {
      values: [
        'Fiction',
        'Poetry',
        'Non-Fiction',
        'Speculative',
        'YA',
        'Religion',
        'Sci-Fi',
        'Fantasy',
        'Essay',
        'Article'
      ],
      message: 'Genre is not supported'
    }
  },
  pitch: {
    type: String,
    trim: true,
    required: true,
    default: '',
    maxlength: [140, 'Pitch must be less or equal to 140 characters.'],
  },
  community: {
    type: String,
    required: [true, 'Story must have assigned community'],
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  }],
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  slug: {
    type: String
  },
  imageCover: {
    type: String,
    default: 'placeholder'
  },
  type: {
    type: String,
    default: 'Text'
  },
  status: {
    type: String,
    default: 'Rumor'
  },
  credibility: {
    type: Number,
    default: 0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  duration: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Document middleware
storySchema.pre('save', function (next) {
  this.slug =
    slugify(this.author + ' ' + this.title, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
    });
  next();
});

// Query middleware
storySchema.pre(/^find/, function (next) {

  next();
});

module.exports = mongoose.model('Story', storySchema);