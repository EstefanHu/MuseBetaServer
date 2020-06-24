const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync.js');
const User = require('../models/User.js');

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let user;
  id ? user = await User.findById(id)
    : user = await User.findById(req.userId);
  res.status(200).json({ status: 'success', payload: user });
});

// TODO: translate to business logic
exports.updateUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, newPassword } = req.body;

  let user = await User.findById(req.userId);

  if (firstName !== user.firstName) updateFirstName(firstName);
  if (lastName !== user.lastName) updateLastName(lastName);
  if (email !== user.email) updateEmail(email);
  if (bcrypt.compare(password, user.password)) updatePassword(newPassword);

  res.status(200).json({ status: 'success', payload: user._id });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.userId);
  res.status(200).json({ status: 'success' });
});

const updateFirstName = async firstName => {
  console.log(firstName);
}

const updateLastName = async lastName => {
  console.log(lastName);
}

const updateEmail = async email => {
  console.log(email);
}

const updatePassword = async password => {
  console.log(password);
}