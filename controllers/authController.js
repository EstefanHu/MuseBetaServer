const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync.js');
const User = require('./../models/User.js');
const AppError = require('./../utils/appError.js');
const sendEmail = require('./../utils/email.js');
const encryptEmailToken = require('./../utils/encryptEmailToken.js');

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  res
    .status(statusCode)
    .json({
      status: 'success',
      token,
      payload: user
    });
}

exports.register = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Must provide email and password', 422));

  let user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password)))
    return next(new AppError('Email or Password was incorrect', 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
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
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to perform this action.', 403));
    next();
  }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('Email does not exist', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocal}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and confirm password to ${resetURL}.\n If you didn'nt forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset token (Valid for 1 hour)',
      message
    });

    res.status(200).json({ status: 'success', payload: 'Token send to email.' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError('Error sending Email. Try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = encryptEmailToken(req.params.token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Token is invalid or has expired.', 401));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!(await user.correctPassword(req.body.passwordCurrent))) {
    return next(new AppError('Incorrect Password', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
});