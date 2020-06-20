const express = require('express');
const storyController = require('../controllers/storyController.js');
const router = express.Router();

router
  .route('/')
  .post(storyController.createPost);

router
  .route('/:id')
  .get(storyController.getPost)
  .patch(storyController.updatePost)
  .delete(storyController.deletePost);

router.get('/community/:community', async (req, res) => {
  try {
    let stories = await Story
      .find({ community: req.params.community })
      .sort({ credibility: 'desc' });

    res.json({ "stories": stories });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;

// router.post('/create', async (req, res) => {
//   try {
//     const {
//       title,
//       pitch,
//       genre,
//       longitude,
//       latitude,
//       community,
//       body,
//     } = req.body;
//     const authorInfo = await User.findById(req.session.userID);
//     const authorName = authorInfo.firstName + ' ' + authorInfo.lastName
//     let story = new Story();
//     story.title = title;
//     story.genre = genre;
//     story.pitch = pitch;
//     story.author = authorName;
//     story.authorId = authorInfo._id;
//     story.community = community;
//     story.body = body;
//     story.longitude = longitude;
//     story.latitude = latitude;
//     await story.save();
//     res.status(201).json({ _id: story._id });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: err });
//   }
// });