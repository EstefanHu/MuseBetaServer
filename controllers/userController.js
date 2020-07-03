const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync.js');
const User = require('./../models/userModel.js');
const Story = require('./../models/storyModel.js');
const AppError = require('./../utils/appError.js');
const factory = require('./../utils/handlerFactory.js');
const mongoose = require('mongoose');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  file.mimetype.startsWith('image') ?
    callback(null, true)
    : callback(new AppError('Not an image. Please upload only images.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
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

exports.addStoryToLibrary = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.body.id);
  if (!story) return next(new AppError('Story does not Exist', 400));
  const isStorySaved = req.user.library.includes(req.body.id);
  if (isStorySaved) return next(new AppError('Story is already in Library', 400));
  await User.findByIdAndUpdate(req.user._id, {
    library: [
      ...req.user.library,
      req.body.id
    ]
  });

  res.status(200).json({ status: 'success', payload: story });
});

exports.removeStoryFromLibrary = catchAsync(async (req, res, next) => {
  console.log(req.body.id);
  console.log(req.user.library);
  await User.findByIdAndUpdate(req.user.id, {
    library:
      req.user.library.filter(
        storyId => storyId != req.body.id
      )
  });

  res.status(201).json({ status: 'success', payload: req.body.id });
});

// ADMIN ONLY
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);