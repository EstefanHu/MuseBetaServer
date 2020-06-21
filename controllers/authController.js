const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.getAuthorization = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      payload: process.env.MAPBOX_ACCESS_TOKEN
    });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(422).json({
        status: 'failure',
        payload: 'Must provide email and password'
      });

    let user = await User.findOne({ email });
    if (!user)
      return res.status(422).json({
        status: 'failure',
        payload: 'Email of Password was incorrect'
      });

    await user.comparePassword(password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch)
        return res.status(422).json({
          status: 'failure',
          payload: 'Email of Password was incorrect'
        });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      res.status(200).json({ status: 'success', payload: token });
    });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
};