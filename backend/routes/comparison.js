/**
 * Comparison Routes
 * Handles comparison of nearby users
 */

const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/compare/nearby
// @desc    Compare nearby users (farmers vs retailers in same region)
// @access  Private
router.get('/nearby', comparisonController.compareNearby);

// @route   GET /api/compare/nearby/:role
// @desc    Get nearby users by role
// @access  Private
router.get('/nearby/:role', comparisonController.getNearbyByRole);

module.exports = router;
