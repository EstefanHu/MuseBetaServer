const Story = require('./../models/storyModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./../utils/handlerFactory.js');
const AppError = require('../utils/appError.js');

exports.getPublicLore = async (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = 'credibilty';
  req.query.status = 'lore';
  req.query.fields = 'title,genre,pitch,body,longitude,latitude';
  next();
}

exports.getStory = factory.getOne(Story, { path: 'reviews' });
exports.getStories = factory.getAll(Story);
exports.createStory = factory.createOne(Story);
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

exports.getStoriesWithin = catchAsync(async (req, res, next) => {
  const { distance, coordinates, unit } = req.params;
  const [lng, lat] = coordinates.split(',');

  if (!lng || !lat)
    next(new AppError('Please provide longitude and latitude in the format lng,lat.', 400));

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const stories = await Story.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res.status(200).json({ status: 'success', results: stories.length, payload: { data: stories } });
});