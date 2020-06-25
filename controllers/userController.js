const catchAsync = require('./../utils/catchAsync.js');
const User = require('../models/User.js');
const AppError = require('./../utils/appError.js');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
}

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let user;
  id ? user = await User.findById(id)
    : user = await User.findById(req.userId);
  res.status(200).json({ status: 'success', payload: user });
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

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.userId);
  res.status(200).json({ status: 'success' });
});