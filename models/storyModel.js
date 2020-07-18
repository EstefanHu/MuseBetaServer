const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const storySchema = new Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [50, 'Title must be less than 50 characters'],
    required: [true, 'Story must have a title'],
    default: ''
  },
  channel: {
    type: String,
    required: [true, 'Story must have a channel'],
    enum: {
      values: [
        'Fiction',
        'Poetry',
        'Narrative',
        'YA',
        'Non-Fiction',
        'Speculative',
        'Article',
        'SciFi',
        'Fantasy',
        'Mystery',
        'Essay',
        'Religion',
      ],
      message: 'Channel is not supported'
    }
  },
  pitch: {
    type: String,
    trim: true,
    required: true,
    default: '',
    maxlength: [280, 'Pitch must be less or equal to 280 characters.'],
  },
  community: {
    type: String,
    required: [true, 'Story must have assigned community.'],
  },
  city: {
    type: String,
    required: [true, 'Story must have assigned city.']
  },
  zip: {
    type: Number,
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
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: {
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
  images: [String],
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
    default: 4.5,
    min: [1, 'Rating muse be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  duration: {
    type: Number,
    default: null
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

storySchema.index({ community: 1 });
storySchema.index({ startLocation: '2dsphere' });

// virtual populate
storySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'modelId',
  localField: '_id'
});

// Document middleware
storySchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
  });
  next();
});

// storySchema.pre('aggregate', function(next){
//   this.pipeline().unshift({$match:{secretStory: {$ne:true}}});

//   next();
// })

module.exports = mongoose.model('Story', storySchema);