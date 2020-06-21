const express = require('express');
const authController = require('../controllers/authController.js');
const router = express.Router();

router
  .route('/')
  // .get(authController.getAuthorization)
  .post(authController.getAuthorized)

module.exports = router;