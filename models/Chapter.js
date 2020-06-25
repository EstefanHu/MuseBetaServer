const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const chapterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Chapter', chapterSchema);