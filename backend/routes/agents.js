/**
 * Ripening Agent Routes
 * Handles all agent-specific endpoints
 */

const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect, isAgent } = require('../middleware/auth');

// All routes require authentication and agent role
router.use(protect);
router.use(isAgent);

// @route   GET /api/agents/dashboard
// @desc    Get agent dashboard data
// @access  Private (Agent only)
router.get('/dashboard', agentController.getDashboard);

// @route   GET /api/agents/produce
// @desc    Get assigned produce
// @access  Private (Agent only)
router.get('/produce', agentController.getAssignedProduce);

// @route   PUT /api/agents/produce/:id/status
// @desc    Update ripening status
// @access  Private (Agent only)
router.put('/produce/:id/status', agentController.updateRipeningStatus);

// @route   PUT /api/agents/orders/:orderId/accept
// @desc    Accept order and assign produce
// @access  Private (Agent only)
router.put('/orders/:orderId/accept', agentController.acceptOrder);

// @route   POST /api/agents/produce/:id/notify-retailer
// @desc    Notify retailer that produce is ready
// @access  Private (Agent only)
router.post('/produce/:id/notify-retailer', agentController.notifyRetailer);

module.exports = router;
