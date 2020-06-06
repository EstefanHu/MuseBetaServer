const router = require('express').Router();
const bcrypt = require('bcryptjs');

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
    res.json("Registration successful");
  } catch (err) {
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
    res.json({key: process.env.MAPBOX_ACCESS_TOKEN});
  } catch (err) {
    res.status(500).json({ err });
  }
})

module.exports = router;