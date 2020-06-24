const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync.js');
const User = require('../models/User.js');
const AppError = require('../utils/appError.js');

const signToken = userId => {
  return jwt.sign(
    { userId }, process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

exports.register = catchAsync(async (req, res, next) => {
  let user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });
  const token = signToken(user._id);
  res.status(201).json({ status: 'success', payload: token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Must provide email and password', 422));

  let user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password)))
    return next(new AppError('Email or Password was incorrect', 401));

  const token = signToken(user._id);
  res.status(200).json({ status: 'success', payload: token });
});