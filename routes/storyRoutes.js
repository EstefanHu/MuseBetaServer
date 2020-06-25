const express = require('express');
const storyController = require('./../controllers/storyController.js');
const { protect } = require('./../controllers/authController.js');
const router = express.Router();

router.route('/public-lore')
  .get(storyController.getPublicLore, storyController.getStories);

router.route('/story-meta').get(storyController.getStoryMeta);
router.route('/daily_meta/:community').get(storyController.getDailyMeta);

router
  .route('/')
  .get(protect, storyController.getStories)
  .post(protect, storyController.createStory);

router
  .route('/:id')
  .get(protect, storyController.getStory)
  .patch(protect, storyController.updateStory)
  .delete(protect, storyController.deleteStory);


module.exports = router;