const express = require('express');
const router = express.Router();
const {
  searchLibraries,
  getAutocomplete,
  getFilterOptions
} = require('../controllers/searchController');

// Search routes
router.get('/', searchLibraries);
router.get('/autocomplete', getAutocomplete);
router.get('/filters', getFilterOptions);

module.exports = router;