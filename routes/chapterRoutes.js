const express = require('express');
const chapterController = require('./../controllers/chapterController.js');
const authController = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/')
  .get(authController.protect, chapterController.getChapters);

router
  .router('/:id')
  .get(authController.protect, chapterController.getChapter)
  .delete(
    authController.protect,
    authController.restrictTo('founder'),
    chapterController.deleteChapter
  );

module.exports = router;