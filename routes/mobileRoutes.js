const router = require('express').Router();
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Story = mongoose.model('Story');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const user = await user.findById();
    res.json(user);
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.get('/story', async (req, res) => {
  try {
    res.json({msg: 'Hello World'});
  } catch (error) {
    res.status(422).send({ error: error });
  }
})

module.exports = router;