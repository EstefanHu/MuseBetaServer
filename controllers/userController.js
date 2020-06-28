const catchAsync = require('./../utils/catchAsync.js');
const User = require('../models/userModel.js');
const AppError = require('./../utils/appError.js');
const factory = require('./../utils/handlerFactory.js');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
}

exports.getMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);
  res.status(200).json({ status: 'success', payload: currentUser });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));

  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');
  const updatedUser =
    await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true
      });

  res.status(200).json({ status: 'success', payload: updatedUser });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'success', payload: null });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  res.status(200).json({ status: 'success', payload: user });
});

// ADMIN ONLY
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);