const User = require('../models/User.js');
const Story = require('../models/Story.js');

exports.createPost = async (req, res) => {
  try {
    const { title, pitch, genre, longitude, latitude, community, body } = req.body;
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
    res.status(201).json({ status: 'success', payload: story._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', payload: error });
  }
};

exports.getPost = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);
    res.json({ status: 'success', payload: story });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', payload: error });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { _id, title, pitch, genre, longitude, latitude, body } = req.body;
    let story = await Story.findByIdAndUpdate({ _id: _id }, { title, pitch, longitude, latitude, body });
    await story.save(); 
    res.json({ status: 'success', payload: 0 });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.deletePost = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', payload: req.params.id });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
};