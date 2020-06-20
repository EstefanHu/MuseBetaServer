const User = require('../models/User.js');

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    let user;
    id ? user = await User.findById(req.params.id)
      : user = await User.findById(req.sessions.userId);
    res.status(200).json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    let checkIfUserExist = await User.findOne({ email: email });
    if (checkIfUserExist) return res.json({ 'error': 'Email already in use' });
    if (password < 8) return res.json({ 'error': 'Password is not long enough' });

    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user = await user.save();

    req.session.userId = user._id;
    res.status(201).json({ status: 'success' })
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // let check = await User.findOne({ email });

    // if (check) {
    //   if (check._id != req.session.userID)
    //     return res.json({ err: 'Email already in use' });

    //   await check.update({
    //     firstName,
    //     lastName
    //   });
    // } else {
    //   await User.findByIdAndUpdate(
    //     { _id: req.session.userID },
    //     {
    //       firstName,
    //       lastName,
    //       email
    //     }
    //   );
    // }

    res.status(200).json({ status: 'success', payload: 'hello world' });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.userId);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}