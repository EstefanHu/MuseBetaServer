const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router
  .route('/')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)

module.exports = router;