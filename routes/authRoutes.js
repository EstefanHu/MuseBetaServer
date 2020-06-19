const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

router.post('/register', async (req, res) => {
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

    req.session.userID = user._id;
    res.status(201).json({ msg: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;
    let user = await User.findOne({ email: email });

    if (!user)
      return res.json({ error: 'Email or Password was incorrect' });
    //TODO:TEST already writtin compare method
    //https://coderrocketfuel.com/article/using-bcrypt-to-hash-and-check-passwords-in-node-js
    await bcrypt.compare(password, user.password, async function (err, isMatch) {
      if (err) throw err;
      if (!isMatch) return res.json({ error: 'Email or Password was incorrect' });
      req.session.userID = user._id;
      res.json('Login successful');
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get('/mapKey', (req, res) => {
  try {
    res.json({ key: process.env.MAPBOX_ACCESS_TOKEN });
  } catch (err) {
    res.status(500).json({ err });
  }
});

//====================
// Mobile Auth Routes
//====================
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ err: 'Must provide email and password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ err: 'Invalid password or email' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ err: 'Invalid password or email' });
  }
});

module.exports = router;