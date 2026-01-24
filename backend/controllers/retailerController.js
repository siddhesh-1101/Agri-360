/**
 * Retailer Controller
 * Handles all retailer-specific operations
 */

const { db, saveAll, generateId } = require('../data/store');

// @desc    Get retailer dashboard data
// @route   GET /api/retailers/dashboard
// @access  Private (Retailer only)
exports.getDashboard = async (req, res) => {
  try {
    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const availableProduce = db.produce
      .filter((p) => p.status === 'available' && (p.region === retailerUser.region))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, 20)
      .map((p) => ({ ...p, farmer: db.users.find((u) => u.id === p.farmerId) ? {
        id: p.farmerId,
        name: `${db.users.find((u) => u.id === p.farmerId).firstName} ${db.users.find((u) => u.id === p.farmerId).lastName}`,
        region: db.users.find((u) => u.id === p.farmerId).region,
        profile: db.users.find((u) => u.id === p.farmerId).profile || {},
      } : null }));

    const orders = db.orders
      .filter((o) => o.retailerId === retailerUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, 10)
      .map((o) => ({
        ...o,
        produce: o.produceIds.map((pid) => db.produce.find((p) => p.id === pid)).filter(Boolean),
        farmer: db.users.find((u) => u.id === o.farmerId) || null,
        agent: o.agentId ? (db.users.find((u) => u.id === o.agentId) || null) : null,
      }));

    // Get statistics
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalSpent: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      availableProduceCount: availableProduce.length,
    };

    const assignedAgentIds = [...new Set(orders.filter((o) => o.agentId).map((o) => o.agentId))];
    const assignedAgents = assignedAgentIds
      .map((id) => db.users.find((u) => u.id === id && u.role === 'agent'))
      .filter(Boolean)
      .slice(0, 10)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, phone: u.phone, email: u.email, region: u.region, profile: u.profile || {} }));

    res.status(200).json({
      success: true,
      data: {
        retailer: {
          id: retailerUser.id,
          firstName: retailerUser.firstName,
          lastName: retailerUser.lastName,
          email: retailerUser.email,
          phone: retailerUser.phone,
          region: retailerUser.region,
          profile: retailerUser.profile || {},
        },
        availableProduce,
        orders,
        stats,
        assignedAgents,
      },
    });
  } catch (error) {
    console.error('Get retailer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Browse available produce
// @route   GET /api/retailers/produce
// @access  Private (Retailer only)
exports.browseProduce = async (req, res) => {
  try {
    const {
      cropName,
      cropType,
      quality,
      minPrice,
      maxPrice,
      region,
      page = 1,
      limit = 20,
    } = req.query;

    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const wantedRegion = region || retailerUser.region;
    let items = db.produce.filter((p) => p.status === 'available' && (!wantedRegion || p.region === wantedRegion));
    if (cropName) items = items.filter((p) => String(p.cropName).toLowerCase().includes(String(cropName).toLowerCase()));
    if (cropType) items = items.filter((p) => p.cropType === cropType);
    if (quality) items = items.filter((p) => p.quality === quality);
    if (minPrice) items = items.filter((p) => Number(p.pricePerUnit) >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => Number(p.pricePerUnit) <= Number(maxPrice));

    const total = items.length;
    const skip = (Number(page) - 1) * Number(limit);
    const produce = items
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(skip, skip + Number(limit))
      .map((p) => ({
        ...p,
        farmer: db.users.find((u) => u.id === p.farmerId)
          ? {
              id: p.farmerId,
              firstName: db.users.find((u) => u.id === p.farmerId).firstName,
              lastName: db.users.find((u) => u.id === p.farmerId).lastName,
              region: db.users.find((u) => u.id === p.farmerId).region,
              profile: db.users.find((u) => u.id === p.farmerId).profile || {},
            }
          : null,
      }));

    res.status(200).json({
      success: true,
      count: produce.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: produce,
    });
  } catch (error) {
    console.error('Browse produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Place an order
// @route   POST /api/retailers/orders
// @access  Private (Retailer only)
exports.placeOrder = async (req, res) => {
  try {
    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const { produceIds, notes, agentId } = req.body;

    if (!produceIds || produceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one produce item',
      });
    }

    const produceItems = produceIds.map((id) => db.produce.find((p) => p.id === id)).filter(Boolean);
    if (produceItems.length !== produceIds.length || produceItems.some((p) => p.status !== 'available')) {
      return res.status(400).json({
        success: false,
        message: 'One or more produce items are not available',
      });
    }

    // ensure same region for hackathon simplicity
    if (produceItems.some((p) => p.region !== retailerUser.region)) {
      return res.status(400).json({ success: false, message: 'Produce must be in the same region as the retailer for this demo' });
    }

    // Calculate total amount and quantity
    const totalAmount = produceItems.reduce(
      (sum, item) => sum + (item.pricePerUnit * item.quantity),
      0
    );
    const farmerId = produceItems[0].farmerId;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    let resolvedAgentId = null;
    if (agentId) {
      const agentUser = db.users.find((u) => u.id === agentId && u.role === 'agent');
      if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });
      if (agentUser.region !== retailerUser.region) return res.status(400).json({ success: false, message: 'Agent must be in same region for this demo' });
      resolvedAgentId = agentUser.id;
    }

    const order = {
      id: generateId('o'),
      orderNumber,
      retailerId: retailerUser.id,
      farmerId,
      produceIds,
      totalAmount,
      status: resolvedAgentId ? 'at_agent' : 'pending',
      agentId: resolvedAgentId,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    db.orders.push(order);

    // mark produce ordered and link retailer + agent if any
    for (const p of produceItems) {
      p.status = resolvedAgentId ? 'at_agent' : 'ordered';
      p.retailerId = retailerUser.id;
      if (resolvedAgentId) {
        p.agentId = resolvedAgentId;
        p.ripeningStatus = 'pending';
      }
    }
    saveAll();

    const populatedOrder = {
      ...order,
      produce: produceItems,
      retailer: retailerUser,
      farmer: db.users.find((u) => u.id === farmerId) || null,
      agent: resolvedAgentId ? (db.users.find((u) => u.id === resolvedAgentId) || null) : null,
    };

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/retailers/orders
// @access  Private (Retailer only)
exports.getOrders = async (req, res) => {
  try {
    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const orders = db.orders
      .filter((o) => o.retailerId === retailerUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map((o) => ({
        ...o,
        produce: o.produceIds.map((pid) => db.produce.find((p) => p.id === pid)).filter(Boolean),
        farmer: db.users.find((u) => u.id === o.farmerId) || null,
        agent: o.agentId ? (db.users.find((u) => u.id === o.agentId) || null) : null,
      }));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Track ripening agents
// @route   GET /api/retailers/agents
// @access  Private (Retailer only)
exports.trackAgents = async (req, res) => {
  try {
    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const ordersWithAgents = db.orders
      .filter((o) => o.retailerId === retailerUser.id && o.agentId)
      .map((o) => ({
        ...o,
        produce: o.produceIds.map((pid) => db.produce.find((p) => p.id === pid)).filter(Boolean),
      }));

    const agentIds = [...new Set(ordersWithAgents.map((o) => o.agentId))];
    const agents = agentIds
      .map((id) => db.users.find((u) => u.id === id && u.role === 'agent'))
      .filter(Boolean)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, region: u.region, profile: u.profile || {} }));

    res.status(200).json({
      success: true,
      data: {
        agents,
        ordersWithAgents,
      },
    });
  } catch (error) {
    console.error('Track agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Compare nearby farmers for this retailer by price/freshness/region
// @route   GET /api/retailers/compare-farmers
// @access  Private (Retailer only)
exports.compareFarmers = async (req, res) => {
  try {
    const retailerUser = db.users.find((u) => u.id === req.user.id && u.role === 'retailer');
    if (!retailerUser) return res.status(404).json({ success: false, message: 'Retailer not found' });

    const region = retailerUser.region;
    const farmers = db.users.filter((u) => u.role === 'farmer' && u.region === region);

    const farmerCards = farmers.map((f) => {
      const items = db.produce.filter((p) => p.farmerId === f.id && p.status === 'available');
      const avgPrice = items.length ? items.reduce((s, p) => s + Number(p.pricePerUnit), 0) / items.length : 0;
      const freshest = items
        .map((p) => p.createdAt)
        .filter(Boolean)
        .sort()
        .slice(-1)[0] || null;
      return {
        farmer: { id: f.id, firstName: f.firstName, lastName: f.lastName, region: f.region, profile: f.profile || {} },
        availableCount: items.length,
        avgPricePerUnit: Math.round(avgPrice * 100) / 100,
        freshestProduceAt: freshest,
        sampleProduce: items.slice(0, 3),
      };
    });

    res.status(200).json({ success: true, data: { region, farmers: farmerCards } });
  } catch (error) {
    console.error('Compare farmers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
