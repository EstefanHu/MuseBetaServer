const User = require('../models/User.js');
const Story = require('../models/Story.js');
const e = require('express');

exports.getStories = async (req, res) => {
  try {
    // const { community, status, } = req.query;
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = Story.find(queryObj);

    req.query.sort ?
      query = query.sort(req.query.sort.split(',').join(' '))
      : query = query.sort('credibility');

    const stories = await query;

    res.status(200).json({ status: 'success', results: stories.length, payload: stories });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
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
    let story = await Story.findOneAndUpdate({
      _id: req.params.id,
      authorId: req.userId
    }, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', payload: story });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.deleteStory = async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id, authorId: req.userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
};