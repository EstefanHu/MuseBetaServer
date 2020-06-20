const express = require('express');
const storyController = require('../controllers/storyController.js');
const router = express.Router();

router
  .route('/:community?')
  .get(storyController.getCommunityStories)
  .post(storyController.createStory);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

module.exports = router;