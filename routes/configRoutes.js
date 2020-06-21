const express = require('express');
const configController = require('../controllers/configController.js');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

router
  .route('/')
  .get(configController.getMapKey);

module.exports = router;