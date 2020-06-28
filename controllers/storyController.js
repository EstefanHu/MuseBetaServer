const User = require('./../models/userModel.js');
const Story = require('./../models/storyModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('../utils/appError.js');
const factory = require('./../utils/handlerFactory.js');

exports.getPublicLore = async (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = 'credibilty';
  req.query.status = 'lore';
  req.query.fields = 'title,genre,pitch,body,longitude,latitude';
  next();
}

exports.getStories = catchAsync(async (req, res, next) => {
  if (!req.query.community) return next('No community was provided', 400);
  const features = new APIFeatures(Story.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const stories = await features.query;

  res.status(200).json({ status: 'success', results: stories.length, payload: stories });
});

exports.createStory = catchAsync(async (req, res, next) => {
  const { title, pitch, genre, longitude, latitude,
    community, body, address, description } = req.body;
  let story = new Story({
    title, genre, pitch,
    author: req.user.name,
    authorId: req.user._id,
    startingLocation: {
      coordinates: [longitude, latitude],
      address, description
    },
    community, body
  });
  const response = await story.save();
  res.status(201).json({ status: 'success', payload: response });
});

exports.getStory = catchAsync(async (req, res, next) => {
  let story = await Story.findById(req.params.id).populate('reviews');
  if (!story) return next(new AppError('No Story found with that ID', 404));
  res.status(200).json({ status: 'success', payload: story });
});

exports.updateStory = factory.updateOne(Story);
exports.deleteStory = factory.deleteOne(Story);

exports.getStoryMeta = catchAsync(async (req, res, next) => {
  const meta = await Story.aggregate([
    {
      $match: { authorId: req.userId }
    },
    {
      $group: {
        _id: { $toUpper: '$status' },
        numStories: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgDuration: { $avg: '$duration' },
        minDuration: { $min: '$duration' },
        maxDuration: { $max: '$duration' }
      }
    },
    {
      $sort: { avgDuration: 1 }
    }
  ]);

  res.status(200).json({ status: 'success', payload: meta });
});

exports.getDailyMeta = catchAsync(async (req, res, next) => {
  const community = req.params.community;

  const data = await Story.aggregate([
    {
      $match: { community: community }
    }
  ])

  res.status(200).json({ status: 'success', payload: { data } })
});