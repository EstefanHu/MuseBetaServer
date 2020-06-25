const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync.js');
const User = require('./../models/User.js');
const AppError = require('./../utils/appError.js');

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
  res.status(201).json({ status: 'success', token, payload: user });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Must provide email and password', 422));

  let user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password)))
    return next(new AppError('Email or Password was incorrect', 401));

  const token = signToken(user._id);
  res.status(200).json({ status: 'success', token, payload: user });
});

exports.protect = catchAsync(async (req, _, next) => {
  // check if token exists
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))
    return next(new AppError('You must log in for access to this resource.', 401));

  // check if token is valid
  const token = req.headers.authorization.replace('Bearer ', '');
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
  const freshUser = await User.findById(decoded.userId);

  // check if user still exists
  if (!freshUser) return next(new AppError('User belonging to token no longer exists.', 401));

  // check if user password had changed since token issue
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next('Password has been changed. Please login again.', 401);

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to perform this action.', 403));
    next();
  }
};