const User = require('./../models/User.js');
const Story = require('./../models/Story.js');
const APIFeatures = require('./../utils/apiFeatures.js');

exports.getPublicLore = async (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = 'credibilty';
  req.query.status = 'lore';
  req.query.fields = 'title,genre,pitch,body,longitude,latitude';
  next();
}

exports.getStories = async (req, res) => {
  try {
    const features = new APIFeatures(Story.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const stories = await features.query;

    res.status(200).json({ status: 'success', results: stories.length, payload: stories });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: 'failure', payload: error });
  }
}

exports.createStory = async (req, res) => {
  try {
    const { title, pitch, genre, longitude, latitude, community, body } = req.body;
    const authorInfo = await User.findById(req.userId);
    let story = new Story({
      title, genre, pitch,
      author: authorInfo.firstName + ' ' + authorInfo.lastName,
      authorId: authorInfo._id,
      longitude, latitude,
      community, body
    });
    const response = await story.save();
    res.status(201).json({ status: 'success', payload: response });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: 'failure', payload: error });
  }
};

exports.getStory = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    res.json({ status: 'success', payload: story });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: 'failure', payload: error });
  }
};

exports.updateStory = async (req, res) => {
  try {
    let story = await Story.findOneAndUpdate({
      _id: req.params.id,
      authorId: req.userId
    }, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', payload: story });
  } catch (error) {
    res.status(404).json({ status: 'failure', payload: error });
  }
}

exports.deleteStory = async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id, authorId: req.userId });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ status: 'failure', payload: error });
  }
};

exports.getStoryMeta = async (req, res) => {
  try {
    const meta = await Story.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$ratingsAverage' },
          avgDuration: { $avg: '$duration' },
          minDuration: { $min: '$duration' },
          maxDuration: { $max: '$duration' }
        }
      }
    ]);

    res.status(200).json({ status: 'success', payload: meta });
  } catch (error) {
    res.status(404).json({ status: 'failure', payload: error });
  }
}