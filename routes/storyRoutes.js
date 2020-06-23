const express = require('express');
const storyController = require('../controllers/storyController.js');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.route('/public-lore')
  .get(storyController.getPublicLore, storyController.getStories);


// ==============
// PRIVATE ROUTES
// ==============
router.use(requireAuth);

router.route('/story-meta').get(storyController.getStoryMeta);
router.route('/daily_meta/:community').get(storyController.getDailyMeta);

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