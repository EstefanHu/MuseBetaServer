const User = require('./../models/User.js');
const Story = require('./../models/Story.js');
const catchAsync = require('./../utils/catchAsync.js');
const APIFeatures = require('./../utils/apiFeatures.js');
const AppError = require('../utils/appError.js');

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
  const { title, pitch, genre, longitude, latitude, community, body } = req.body;
  let story = new Story({
    title, genre, pitch,
    author: req.user.authorName,
    authorId: req.user._id,
    longitude, latitude,
    community, body
  });
  const response = await story.save();
  res.status(201).json({ status: 'success', payload: response });
});

exports.getStory = catchAsync(async (req, res, next) => {
  let story = await Story.findById(req.params.id);
  if (!story) return next(new AppError('No Story found with that ID', 404));
  res.json({ status: 'success', payload: story });
});

exports.updateStory = catchAsync(async (req, res, next) => {
  let story = await Story.findOneAndUpdate({
    _id: req.params.id,
    authorId: req.userId
  }, req.body, {
    new: true,
    runValidators: true
  });
  if (!story) return next(new AppError('No Story found with that ID', 404));
  res.status(200).json({ status: 'success', payload: story });
});

exports.deleteStory = catchAsync(async (req, res, next) => {
  const story = await Story.deleteOne({ _id: req.params.id, authorId: req.userId });
  if (!story) return next(new AppError('No Story found with that ID', 404));
  res.status(204).json({ status: 'success', payload: null });
});

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