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
    await User.findByIdAndDelete(req.userId);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  }
}