const router = require('express').Router();

router.post('/create', async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      genre,
      longitude,
      latitude,
      community,
      body
    } = req.body;
    let story;

    if (id !== undefined) {
      story = await Story.findByIdAndUpdate(
        { _id: id },
        {
          title: title,
          description: description,
          coordinates: [longitude, latitude],
          body: body,
        }
      );
    } else {
      const authorInfo = await User.findById(req.session.userID);
      const authorName = authorInfo.firstName + ' ' + authorInfo.lastName
      story = new Story();
      story.title = title;
      story.description = description;
      story.genre = genre;
      story.author = authorName;
      story.authorId = authorInfo._id;
      story.community = community;
      story.body = body;
      story.coordinates = [longitude, latitude];
    }
    await story.save();

    res.json('Story Published');
  } catch (error) {
    res.status(500).json('Error: ' + error);
  }
});

// router.get('/populate/:community', async (req, res) => {
//   try {
//     let library = await Entry
//       .find({ authorId: req.session.userID })
//       .sort({ createAt: 'desc' });
//     let feed = await Entry
//       .find({ community: req.params.community })
//       .sort({ createdAt: 'desc' });
//     res.json({ library, feed });
//   } catch (error) {
//     res.status(500).json('Error: ' + error);
//   }
// });

router.get('/library', async (req, res) => {
  try {
    let stories = await Story
      .find({ authorId: req.session.userID })
      .sort({ createdAt: 'desc' });
    res.json({ "stories": stories });
  } catch (error) {
    res.status(500).json('Error: ' + error);
  }
});

router.get('/community/:community', async (req, res) => {
  try {
    let stories = await Story
      .find({ community: req.params.community })
      .sort({ createdAt: 'desc' });

    res.json({ "stories": stories });
  } catch (error) {
    res.status(500).json('Error: ' + error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    res.json(story);
  } catch (error) {
    res.type('text').status(500).send('Error: ' + error);
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.send('Deleted Story');
  } catch (error) {
    res.type('text').status(500).send('Error: ' + error);
  }
});

module.exports = router;