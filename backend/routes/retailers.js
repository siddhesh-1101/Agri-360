/**
 * Retailer Routes
 * Handles all retailer-specific endpoints
 */

const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');
const { protect, isRetailer } = require('../middleware/auth');

// All routes require authentication and retailer role
router.use(protect);
router.use(isRetailer);

// @route   GET /api/retailers/dashboard
// @desc    Get retailer dashboard data
// @access  Private (Retailer only)
router.get('/dashboard', retailerController.getDashboard);

// @route   GET /api/retailers/produce
// @desc    Browse available produce
// @access  Private (Retailer only)
router.get('/produce', retailerController.browseProduce);

// @route   GET /api/retailers/orders
// @desc    Get all orders placed by retailer
// @access  Private (Retailer only)
router.get('/orders', retailerController.getOrders);

// @route   POST /api/retailers/orders
// @desc    Place an order
// @access  Private (Retailer only)
router.post('/orders', retailerController.placeOrder);

// @route   GET /api/retailers/agents
// @desc    Track ripening agents
// @access  Private (Retailer only)
router.get('/agents', retailerController.trackAgents);

// @route   GET /api/retailers/compare-farmers
// @desc    Compare nearby farmers by price/freshness/region
// @access  Private (Retailer only)
router.get('/compare-farmers', retailerController.compareFarmers);

module.exports = router;
