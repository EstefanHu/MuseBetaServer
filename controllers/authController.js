const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// exports.getAuthorization = async (req, res) => {
//   try {
//     res.status(200).json({
//       status: 'success',
//       payload: process.env.MAPBOX_ACCESS_TOKEN
//     });
//   } catch (error) {
//     res.status(500).json({ status: 'failure', payload: error });
//   }
// }

exports.getAuthorized = async (req, res) => {
  try {
    if (req.body.type === 'login') {
      const { email, password } = req.body.payload;
      if (!email || !password)
        return res.status(422).json({
          status: 'failure',
          payload: 'Must provide email and password'
        });

      let user = await User.findOne({ email });
      if (!user)
        return res.status(422).json({
          status: 'failure',
          payload: 'Email or Password was incorrect'
        });

      await user.comparePassword(password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch)
          return res.status(422).json({
            status: 'failure',
            payload: 'Email or Password was incorrect'
          });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ status: 'success', payload: token });
      });
    } else {
      const { firstName, lastName, email, password } = req.body.payload;

      let checkIfUserExist = await User.findOne({ email });
      if (checkIfUserExist)
        return res.status(422).json({
          status: 'failure',
          payload: 'Email already in use'
        });

      if (password < 8)
        return res.status(422).json({
          status: 'failure',
          payload: 'Password is not long enough'
        });

      let user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;
      user = await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
      res.status(201).json({ status: 'success', payload: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failure', payload: error });
  }
};