const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const chapterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  founder: {
    type: String //will reference user
  }
});

module.exports = mongoose.model('Chapter', chapterSchema);