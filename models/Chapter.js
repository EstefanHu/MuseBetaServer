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
  },
  photo: String,
  slug: String,
});

chapterSchema.pre('save', function (next) {
  this.slug =
    slugify(this.name, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
    });
  next();
});

module.exports = mongoose.model('Chapter', chapterSchema);