const express = require('express');
const storyController = require('../controllers/storyController.js');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

router
  .route('/')
  .post(storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

router
  .route('/community/:community')
  .get(storyController.getCommunityStories);

module.exports = router;