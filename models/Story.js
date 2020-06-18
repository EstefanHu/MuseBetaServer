const mongoose = require('mongoose');
const { Schema } = mongoose;

const storySchema = new Schema({
  title: {
    type: String,
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
    required: true,
    default: ''
  },
  credibility: {
    type: Number,
    default: 0
  },
  community: {
    type: String,
    default: ''
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
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
    default: Date.now
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);