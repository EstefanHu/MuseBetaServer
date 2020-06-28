const mongoose = require('mongoose');
const Story = require('./storyModel.js');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: [true, 'Review can not be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  modelId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'modelName'
  },
  modelName: {
    type: String,
    required: true,
    enum: ['Story']
  },
  credibility: {
    type: Number,
    default: 0
  },
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
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (modelId, modelName) {
  const stats = await this.aggregate([
    {
      $match: { modelId }
    },
    {
      $group: {
        _id: '$modelId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  let model;
  switch (modelName) {
    case 'Story':
      model = Story;
      break;
    default:
      break;
  }

  if (stats.length > 0) {
    await model.findByIdAndUpdate(modelId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await model.findByIdAndUpdate(modelId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.modelId, this.modelName);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.modelId, this.r.modelName);
});

module.exports = mongoose.model('Review', reviewSchema);