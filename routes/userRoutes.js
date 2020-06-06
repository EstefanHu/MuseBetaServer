const router = require('express').Router();

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/update', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email
    } = req.body;

    let check = await User.findOne({ email });

    if (check) {
      if (check._id != req.session.userID)
        return res.json({ err: 'Email already in use' });

      await check.update({
        firstName,
        lastName
      });
    } else {
      await User.findByIdAndUpdate(
        { _id: req.session.userID },
        {
          firstName,
          lastName,
          email
        }
      );
    }

    res.json({ msg: 'Success' });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/resecure', async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    await User.findById(
      req.session.userID,
      function (err, user) {
        if (err) throw err;

        user.comparePassword(currentPassword, async function (err, isMatch) {
          if (err) throw err;
          if (!isMatch) return res.json({ err: 'Your password was incorrect.' });

          user.password = newPassword;
          await user.save();
          res.json({ msg: 'password updated' });
        });
      });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send('Deleted User');
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) throw err
    });
    res.json({ msg: 'User logged out.' });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;