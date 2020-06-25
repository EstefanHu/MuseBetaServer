const express = require('express');
const configController = require('./../controllers/configController.js');
const { protect } = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/')
  .get(protect, configController.getMapKey);

module.exports = router;