/**
 * Ripening Agent Controller
 * Handles all agent-specific operations
 */

const { db, saveAll } = require('../data/store');

// @desc    Get agent dashboard data
// @route   GET /api/agents/dashboard
// @access  Private (Agent only)
exports.getDashboard = async (req, res) => {
  try {
    const agentUser = db.users.find((u) => u.id === req.user.id && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const assignedProduce = db.produce
      .filter((p) => p.agentId === agentUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map((p) => ({
        ...p,
        farmer: db.users.find((u) => u.id === p.farmerId) || null,
        retailer: p.retailerId ? (db.users.find((u) => u.id === p.retailerId) || null) : null,
      }));

    const assignedOrders = db.orders
      .filter((o) => o.agentId === agentUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map((o) => ({
        ...o,
        produce: o.produceIds.map((pid) => db.produce.find((p) => p.id === pid)).filter(Boolean),
        farmer: db.users.find((u) => u.id === o.farmerId) || null,
        retailer: db.users.find((u) => u.id === o.retailerId) || null,
      }));

    // Get statistics
    const stats = {
      assignedProduceCount: assignedProduce.length,
      ripeningInProgress: assignedProduce.filter(p => p.ripeningStatus === 'in_progress').length,
      readyForDelivery: assignedProduce.filter(p => p.ripeningStatus === 'ready').length,
      completedProduce: assignedProduce.filter(p => p.ripeningStatus === 'completed').length,
      totalOrders: assignedOrders.length,
      activeOrders: assignedOrders.filter(o => o.status === 'ripening' || o.status === 'at_agent').length,
    };

    res.status(200).json({
      success: true,
      data: {
        agent: { id: agentUser.id, firstName: agentUser.firstName, lastName: agentUser.lastName, email: agentUser.email, phone: agentUser.phone, region: agentUser.region, profile: agentUser.profile || {} },
        assignedProduce,
        assignedOrders,
        stats,
      },
    });
  } catch (error) {
    console.error('Get agent dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get assigned produce
// @route   GET /api/agents/produce
// @access  Private (Agent only)
exports.getAssignedProduce = async (req, res) => {
  try {
    const agentUser = db.users.find((u) => u.id === req.user.id && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const { status } = req.query;
    let produce = db.produce.filter((p) => p.agentId === agentUser.id);
    if (status) produce = produce.filter((p) => p.ripeningStatus === status);
    produce = produce.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    res.status(200).json({
      success: true,
      count: produce.length,
      data: produce,
    });
  } catch (error) {
    console.error('Get assigned produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update ripening status
// @route   PUT /api/agents/produce/:id/status
// @access  Private (Agent only)
exports.updateRipeningStatus = async (req, res) => {
  try {
    const agentUser = db.users.find((u) => u.id === req.user.id && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const { ripeningStatus } = req.body;
    const validStatuses = ['pending', 'in_progress', 'ready', 'completed'];

    if (!validStatuses.includes(ripeningStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const produce = db.produce.find((p) => p.id === req.params.id);
    if (!produce) return res.status(404).json({ success: false, message: 'Produce not found' });
    if (produce.agentId !== agentUser.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    produce.ripeningStatus = ripeningStatus;
    if (ripeningStatus === 'in_progress') produce.status = 'ripening';
    if (ripeningStatus === 'ready') produce.status = 'ready';
    if (ripeningStatus === 'completed') produce.status = 'ready';
    saveAll();

    // If status is ready, notify retailer (in a real app, you'd send email/push notification)
    if (ripeningStatus === 'ready' && produce.retailerId) {
      const retailer = db.users.find((u) => u.id === produce.retailerId);
      console.log(`Produce ${produce.id} is ready for retailer ${retailer?.email || produce.retailerId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Ripening status updated successfully',
      data: produce,
    });
  } catch (error) {
    console.error('Update ripening status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Assign produce to agent (called when order is assigned)
// @route   PUT /api/agents/orders/:orderId/accept
// @access  Private (Agent only)
exports.acceptOrder = async (req, res) => {
  try {
    const agentUser = db.users.find((u) => u.id === req.user.id && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const order = db.orders.find((o) => o.id === req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.agentId = agentUser.id;
    order.status = 'at_agent';

    for (const pid of order.produceIds) {
      const p = db.produce.find((x) => x.id === pid);
      if (p) {
        p.agentId = agentUser.id;
        p.status = 'at_agent';
        p.ripeningStatus = 'pending';
      }
    }
    saveAll();

    const populatedOrder = {
      ...order,
      retailer: db.users.find((u) => u.id === order.retailerId) || null,
      farmer: db.users.find((u) => u.id === order.farmerId) || null,
      produce: order.produceIds.map((pid) => db.produce.find((p) => p.id === pid)).filter(Boolean),
      agent: agentUser,
    };

    res.status(200).json({
      success: true,
      message: 'Order accepted and produce assigned successfully',
      data: populatedOrder,
    });
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Notify retailer that produce is ready
// @route   POST /api/agents/produce/:id/notify-retailer
// @access  Private (Agent only)
exports.notifyRetailer = async (req, res) => {
  try {
    const agentUser = db.users.find((u) => u.id === req.user.id && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const produce = db.produce.find((p) => p.id === req.params.id);
    if (!produce) return res.status(404).json({ success: false, message: 'Produce not found' });
    if (produce.agentId !== agentUser.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (produce.ripeningStatus !== 'ready') return res.status(400).json({ success: false, message: 'Produce is not ready' });

    // For hackathon demo: mark as notified
    produce.notifiedRetailerAt = new Date().toISOString();
    saveAll();

    res.status(200).json({
      success: true,
      message: 'Retailer notified successfully',
      data: {
        produce,
        retailer: produce.retailerId ? (db.users.find((u) => u.id === produce.retailerId) || { id: produce.retailerId }) : null,
        notificationSent: true,
        // In production, include notification details
      },
    });
  } catch (error) {
    console.error('Notify retailer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
