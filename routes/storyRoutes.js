const router = require('express').Router();
const User = require('../models/User.js');
const Story = require('../models/Story.js');

router.post('/create', async (req, res) => {
  console.log('Recieved Story --->');
  try {
    const {
      title,
      pitch,
      genre,
      longitude,
      latitude,
      community,
      body
    } = req.body;
    const authorInfo = await User.findById(req.session.userID);
    const authorName = authorInfo.firstName + ' ' + authorInfo.lastName
    let story = new Story();
    story.title = title;
    story.genre = genre;
    story.pitch = pitch;
    story.author = authorName;
    story.authorId = authorInfo._id;
    story.community = community;
    story.body = body;
    story.longitude = longitude;
    story.latitude = latitude;
    await story.save();
    res.status(201).json({_id: story._id});
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

router.post('/update', async (req, res) => {
  try {
    const {
      id,
      title,
      pitch,
      genre,
      longitude,
      latitude,
      community,
      body
    } = req.body;
    let story = await Story.findByIdAndUpdate(
      { _id: id },
      {
        title: title,
        pitch: pitch,
        coordinates: [longitude, latitude],
        body: body,
      }
    );
    await story.save(); //TODO: CHECK IF NEEDED
  } catch (err) {
    res.status(500).json({ err: err });
  }
})

// router.get('/populate/:community', async (req, res) => {
//   try {
//     let library = await Entry
//       .find({ authorId: req.session.userID })
//       .sort({ createAt: 'desc' });
//     let feed = await Entry
//       .find({ community: req.params.community })
//       .sort({ createdAt: 'desc' });
//     res.json({ library, feed });
//   } catch (err) {
//     res.status(500).json({ err })
//   }
// });

router.get('/library', async (req, res) => {
  try {
    let stories = await Story
      .find({ authorId: req.session.userID })
      .sort({ createdAt: 'desc' });
    res.json({ "stories": stories });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get('/community/:community', async (req, res) => {
  try {
    let stories = await Story
      .find({ community: req.params.community })
      .sort({ createdAt: 'desc' });

    res.json({ "stories": stories });
  } catch (err) {
    res.status(500).json({ err });
  }
})

router.get('/:id', async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    res.json(story);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.send('Deleted Story');
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;