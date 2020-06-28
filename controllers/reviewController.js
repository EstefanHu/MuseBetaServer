const Review = require('./../models/reviewModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const factory = require('./../utils/handlerFactory.js');

exports.setStoryUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.modelId) req.body.modelId = req.params.modelId;
  next();
}

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.modelId) filter = { modelId: req.params.modelId };
  const reviews = await Review.find(filter);
  res.status(200).json({ status: 'success', results: reviews.length, payload: reviews });
});

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);