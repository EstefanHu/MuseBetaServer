const express = require('express');
const monumentController = require('./../controllers/monumentController.js');
const authController = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/')
  .get(authController.protect, monumentController.getMonumnets)
  .post(authController.protect, monumentController.createMonument);

router
  .route('/:id')
  .get(authController.protect, monumentController.getMonumnet)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    monumentController.deleteMonument
  );

module.exports = router;