const Chapter = require('./../models/Chapter.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const APIFeatures = require('../utils/apiFeatures.js');

exports.getChapters = catchAsync(async (req, res, next) => {
  if (req.query.community) return next('No community was provided', 400);
  const featuers = new APIFeatures(Chapter.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const chapters = await featuers.query;

  res.status(200).json({ status: 'success', results: chapters.length, payload: chapters });
});

exports.createChapter = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let chapter = Chapter.create({ name });
  res.status(201).json({ status: 'success', payload: chapter });
});

exports.getChapter = catchAsync(async (req, res, next) => {
  let chapter = await Chapter.findById(req.params.id);
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  res.status(200).json({ type: 'success', payload: chapter });
});

exports.deleteChapter = catchAsync(async (req, res, next) => {
  const chapter = await Chapter.deleteOne({ _id: req.params.id });
  if (!chapter) return next(new AppError('No chapter found with that ID', 404));
  res.status(204).json({ status: 'success', payload: null });
});