const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const user = await user.findById();
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get('/logout', (req, res) => {
  try {
    res.json({ msg: 'Loging out' });
  } catch (err) {
    res.status(500).json({ err });
  }
})

module.exports = router;