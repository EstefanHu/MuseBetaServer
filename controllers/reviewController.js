const Review = require('./../models/reviewModel.js');
const catchAsync = require('./../utils/catchAsync.js');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({ status: 'success', results: reviews.length, payload: reviews });
});

exports.createReview = catchAsync(async (req, res, next) => {
  console.log('recieved');
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.modelId) req.body.modelId = req.params.id;

  console.log(req.body);

  const newReview = await Review.create(req.body);
  console.log(newReview)
  res.status(201).json({ status: 'success', payload: newReview });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({ status: 'success', payload: review });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success', payload: 'updated' })
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success', payload: 'delteted' });
});