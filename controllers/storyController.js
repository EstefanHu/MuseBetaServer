const mongoose = require('mongoose');
const Story = require('./../models/storyModel.js');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./../utils/handlerFactory.js');
const AppError = require('../utils/appError.js');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  file.mimetype.startsWith('image') ?
    callback(null, true)
    : callback(new AppError('Not an image. Please upload only images.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadStoryImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeStoryImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = `story-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/stories/${req.body.imageCover}`);

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `story-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/stories/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.setUserId = (req, res, next) => {
  if (!req.body.authorId) req.body.authorId = req.user.id;
  if (!req.body.authorName) req.body.authorName = req.user.name;
  next();
}

exports.getPublicLore = async (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = 'credibilty';
  req.query.status = 'lore';
  req.query.fields = 'title,genre,pitch,body,longitude,latitude';
  next();
};

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

exports.getLibrary = catchAsync(async (req, res, next) => {
  const library = await Story.find({
    '_id': {
      $in: req.user.library.map(id => {
        return mongoose.Types.ObjectId(id);
      })
    }
  });

  res.status(200).json({ status: 'success', payload: library });
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

exports.getDistances = catchAsync(async (req, res, next) => {
  const { coordinates, unit } = req.params;
  const [lng, lat] = coordinates.split(',');

  if (!lng || !lat)
    next(new AppError('Please provide longitude and latitude in the format lng,lat.', 400));

  const distances = await Story.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat]
        },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.0001
      }
    },
    {
      $project: {
        distance: 1,
        title: 1
      }
    }
  ]);

  res.status(200).json({ status: 'success', payload: distances });
});

exports.getStoryDistanceFromUser = catchAsync(async (req, res, next) => {
  const { id, coordinates, unit } = req.params;
  const [lng, lat] = coordinates.split(',');

  if (!lng || !lat)
    next(new AppError('Please provide longitude and latitude in the format lng,lat.', 400));

  const distance = await Story.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat]
        },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.0001
      }
    },
    {
      $project: {
        distance: 1,
        title: 1
      }
    }
  ]);

  res.status(200).json({ status: 'success', payload: distance });
});