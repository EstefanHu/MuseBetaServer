const express = require('express');
const storyController = require('../controllers/storyController.js');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

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