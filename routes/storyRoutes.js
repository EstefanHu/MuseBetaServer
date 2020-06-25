const express = require('express');
const storyController = require('./../controllers/storyController.js');
const authController = require('./../controllers/authController.js');
const router = express.Router();

router.route('/public-lore')
  .get(storyController.getPublicLore, storyController.getStories);

router.route('/story-meta').get(storyController.getStoryMeta);
router.route('/daily_meta/:community').get(storyController.getDailyMeta);

router
  .route('/')
  .get(authController.protect, storyController.getStories)
  .post(authController.protect, storyController.createStory);

router
  .route('/:id')
  .get(authController.protect, storyController.getStory)
  .patch(authController.protect, storyController.updateStory)
  .delete(
    authController.protect,
    // authController.restrictTo('admin'),
    storyController.deleteStory
  );


module.exports = router;