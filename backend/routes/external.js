const express = require('express');
const router = express.Router();
const {
  searchExternal,
  searchCombined
} = require('../controllers/externalController');

// External library search routes
router.get('/search-external', searchExternal);
router.get('/search-combined', searchCombined);

module.exports = router;