const express = require('express');
const storyController = require('./../controllers/storyController.js');
const authController = require('./../controllers/authController.js');
const reviewRouter = require('./../routes/reviewRoutes.js')
const router = express.Router();

router.use('/:modelId/reviews', reviewRouter);

router.route('/public-lore')
  .get(storyController.getPublicLore, storyController.getStories);

router.route('/story-meta').get(storyController.getStoryMeta);
router.route('/daily_meta/:community').get(storyController.getDailyMeta);

router.use(authController.protect);

router
  .route('/story-within/:distance/center/:coordinates/unit/:unit')
  .get(storyController.getStoriesWithin);

router
  .route('/')
  .get(storyController.getStories)
  .post(storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

module.exports = router;