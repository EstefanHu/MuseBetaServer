const express = require('express');
const authController = require('../controllers/authController.js');
const router = express.Router();

router
  .route('/')
  .get(authController.getAuthorization)
  .post(authController.login)

module.exports = router;