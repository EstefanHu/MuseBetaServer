const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/addStoryToLibrary', userController.addStoryToLibrary);
router.patch('/removeStoryFromLibrary', userController.removeStoryFromLibrary);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.get('/myStories', userController.getMe, userController.getStories);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;