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
    required: true,
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
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);