const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();

router
  .route('/')
  .get(authController.getAuthorization)
  .post(authController.login)

module.exports = router;

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