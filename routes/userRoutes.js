const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const requireAuth = require('./../middlewares/requireAuth.js');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router.use(requireAuth);

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/:id')
  .get(userController.getUser)

module.exports = router;

// router.post('/resecure', async (req, res) => {
//   try {
//     const {
//       currentPassword,
//       newPassword
//     } = req.body;

//     await User.findById(
//       req.session.userID,
//       function (err, user) {
//         if (err) throw err;

//         user.comparePassword(currentPassword, async function (err, isMatch) {
//           if (err) throw err;
//           if (!isMatch) return res.json({ err: 'Your password was incorrect.' });

//           user.password = newPassword;
//           await user.save();
//           res.json({ msg: 'password updated' });
//         });
//       });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });

// router.get('/logout', (req, res) => {
//   try {
//     req.session.destroy(err => {
//       if (err) throw err
//     });
//     res.json({ msg: 'User logged out.' });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });