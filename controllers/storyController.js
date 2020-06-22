const User = require('../models/User.js');
const Story = require('../models/Story.js');

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
    res.status(500).json({ status: 'failure', payload: error });
  }
};

exports.getStory = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    res.json({ status: 'success', payload: story });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', payload: error });
  }
};

exports.updateStory = async (req, res) => {
  try {
    let story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    await story.save();
    res.json({ status: 'success', payload: story });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', payload: req.params.id });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
};

exports.getCommunityStories = async (req, res) => {
  try {
    let stories = await Story
      .find({ community: req.params.community })
      .sort({ credibility: 'desc' });

    res.status(200).json({ status: 'success', results: stories.length, payload: stories });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}