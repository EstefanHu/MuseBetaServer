const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  storyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Story'
  },
  credibility: {
    type: Number,
    default: 0
  },
  reports: Array,
  createdAt: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Review', reviewSchema);