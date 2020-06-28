const Review = require('./../models/reviewModel.js');
const factory = require('./../utils/handlerFactory.js');

exports.setStoryUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.modelId) req.body.modelId = req.params.modelId;
  next();
}

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);