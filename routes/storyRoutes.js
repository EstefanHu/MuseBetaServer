const express = require('express');
const storyController = require('./../controllers/storyController.js');
const authController = require('./../controllers/authController.js');
const reviewRouter = require('./../routes/reviewRoutes.js')
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
    storyController.deleteStory
  );

router.use('/:modelId/reviews', reviewRouter);

module.exports = router;