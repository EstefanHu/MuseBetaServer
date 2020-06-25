const Monument = requrie('./../models/Monument.js');
const catchAsync = require('./../utils/catchAsync.js');
const APIFeatures = require('../utils/apiFeatures.js');
const AppError = require('./../utils/appError.js');

exports.getMonuments = catchAsync(async (req, res, next) => {
  if (req.query.community) return next('No community was provided.', 400);
  const features = new APIFeatures(Monument.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const monuments = await features.query;

  res.status(200).json({ status: 'success', results: monuments.length, payload: monuments });
});

exports.createMonument = catchAsync(async (req, res, next) => {
  const monument = await Monument.create({
    name: req.body.name,
    spirit: req.body.spirit,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
  });
  res.status(201).json({ status: 'success', payload: monument });
});

exports.deleteMonument = catchAsync(async (req, res, next) => {
  const monument = await Monument.deleteOne({ _id: req.params.id });
  if (!monument) return next(new AppError('No Monumnet with that ID', 404));
  res.status(204).json({ type: 'success', payload: null });
});