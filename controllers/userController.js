const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    let user;
    id ? user = await User.findById(id)
      : user = await User.findById(req.userId);
    res.status(200).json({ status: 'success', payload: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, newPassword } = req.body;

    let user = await User.findById(req.userId);

    if (firstName !== user.firstName) updateFirstName(firstName);
    if (lastName !== user.lastName) updateLastName(lastName);
    if (email !== user.email) updateEmail(email);
    if (bcrypt.compare(password, user.password)) updatePassword(newPassword);

    res.status(200).json({ status: 'success', payload: user._id });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

const updateFirstName = async firstName => {
  console.log(firstName);
}

const updateLastName = async lastName => {
  console.log(lastName);
}

const updateEmail = async email => {
  console.log(email);
}

const updatePassword = async password => {
  console.log(password);
}