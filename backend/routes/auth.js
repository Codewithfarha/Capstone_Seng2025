const express = require('express');
const router = express.Router();
const { verifyAuth, verifyAdmin } = require('../middleware/authMiddleware');
const {
  verifyToken,
  getUserProfile,
  setUserRole
} = require('../controllers/authController');

// Auth routes
router.post('/verify', verifyToken);
router.get('/profile', verifyAuth, getUserProfile);
router.post('/set-role', verifyAuth, verifyAdmin, setUserRole);

module.exports = router;