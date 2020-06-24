const catchAsync = require('./../utils/catchAsync.js');

exports.getMapKey = catchAsync((_, res, next) => {
  res.status(200).json({
    status: 'success',
    payload: process.env.MAPBOX_ACCESS_TOKEN
  });
});