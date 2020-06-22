const mongoose = require('mongoose');
const { Schema } = mongoose;

const storySchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    default: ''
  },
  genre: {
    type: String,
    required: true,
    default: ''
  },
  pitch: {
    type: String,
    trim: true,
    required: true,
    default: ''
  },
  community: {
    type: String,
    required: true,
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
  numOfRatings: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: null
  },
  duration: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);