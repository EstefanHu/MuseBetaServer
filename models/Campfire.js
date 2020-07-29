const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const campfireSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  longitude: {
    type: Number,
    trim: true,
    required: true,
  },
  latitude: {
    type: Number,
    trim: true,
    required: true
  },
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }],
  multiplyer: {
    type: Number,
  },
  slug: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

campfireSchema.virtualI('stories', {
  ref: 'Story',
  foreignField: 'campfireId',
  localField: '_id'
});

campfireSchema.pre('save', function (next) {
  this.slug =
    slugify(this.name, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
    });
  next();
});

module.exports = mongoose.mode3l('Campfire', campfireSchema);