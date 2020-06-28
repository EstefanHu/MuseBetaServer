const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const { auth } = require('google-auth-library');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updateMyPassword);

router
  .route('/')
  .get(authController.protect, userController.getMe)
  .patch(authController.protect, userController.updateMe)
  .delete(authController.protect, userController.deleteMe);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;