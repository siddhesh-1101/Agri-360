/**
 * Farmer Routes
 * Handles all farmer-specific endpoints
 */

const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { protect, isFarmer } = require('../middleware/auth');

// All routes require authentication and farmer role
router.use(protect);
router.use(isFarmer);

// @route   GET /api/farmers/dashboard
// @desc    Get farmer dashboard data
// @access  Private (Farmer only)
router.get('/dashboard', farmerController.getDashboard);

// @route   GET /api/farmers/produce
// @desc    Get all produce uploaded by farmer
// @access  Private (Farmer only)
router.get('/produce', farmerController.getMyProduce);

// @route   POST /api/farmers/produce
// @desc    Upload produce details
// @access  Private (Farmer only)
router.post('/produce', farmerController.uploadProduce);

// @route   PUT /api/farmers/produce/:id
// @desc    Update produce details
// @access  Private (Farmer only)
router.put('/produce/:id', farmerController.updateProduce);

// @route   PUT /api/farmers/produce/:id/assign-agent
// @desc    Assign produce to a ripening agent
// @access  Private (Farmer only)
router.put('/produce/:id/assign-agent', farmerController.assignAgent);

// @route   DELETE /api/farmers/produce/:id
// @desc    Delete produce
// @access  Private (Farmer only)
router.delete('/produce/:id', farmerController.deleteProduce);

// @route   GET /api/farmers/nearby-retailers
// @desc    Get nearby retailers in same region
// @access  Private (Farmer only)
router.get('/nearby-retailers', farmerController.getNearbyRetailers);

module.exports = router;
