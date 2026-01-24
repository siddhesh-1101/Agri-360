/**
 * Farmer Controller
 * Handles all farmer-specific operations
 */

const { db, saveAll, generateId } = require('../data/store');

// @desc    Get farmer dashboard data
// @route   GET /api/farmers/dashboard
// @access  Private (Farmer only)
exports.getDashboard = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const produce = db.produce
      .filter((p) => p.farmerId === farmerUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    // Get statistics
    const stats = {
      totalProduce: produce.length,
      availableProduce: produce.filter(p => p.status === 'available').length,
      orderedProduce: produce.filter(p => p.status === 'ordered').length,
      soldProduce: produce.filter(p => p.status === 'sold').length,
      totalRevenue: produce
        .filter(p => p.status === 'sold')
        .reduce((sum, p) => sum + (p.pricePerUnit * p.quantity), 0),
    };

    // Get nearby retailers (in same region)
    const nearbyRetailers = db.users
      .filter((u) => u.role === 'retailer' && u.region === farmerUser.region && u.id !== farmerUser.id)
      .slice(0, 10)
      .map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        region: u.region,
        profile: u.profile || {},
      }));

    res.status(200).json({
      success: true,
      data: {
        farmer: {
          id: farmerUser.id,
          firstName: farmerUser.firstName,
          lastName: farmerUser.lastName,
          email: farmerUser.email,
          phone: farmerUser.phone,
          region: farmerUser.region,
          profile: farmerUser.profile || {},
        },
        produce,
        stats,
        nearbyRetailers,
      },
    });
  } catch (error) {
    console.error('Get farmer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Upload produce details
// @route   POST /api/farmers/produce
// @access  Private (Farmer only)
exports.uploadProduce = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const {
      cropName,
      cropType,
      quantity,
      unit,
      pricePerUnit,
      quality,
      description,
    } = req.body;

    if (!cropName || !cropType || quantity == null || pricePerUnit == null) {
      return res.status(400).json({ success: false, message: 'cropName, cropType, quantity, pricePerUnit are required' });
    }

    const produce = {
      id: generateId('p'),
      farmerId: farmerUser.id,
      cropName,
      cropType,
      quantity: Number(quantity),
      unit: unit || 'kg',
      pricePerUnit: Number(pricePerUnit),
      quality: quality || 'good',
      description: description || '',
      region: farmerUser.region,
      status: 'available',
      agentId: null,
      retailerId: null,
      ripeningStatus: null,
      createdAt: new Date().toISOString(),
    };

    db.produce.push(produce);
    saveAll();

    res.status(201).json({
      success: true,
      message: 'Produce uploaded successfully',
      data: produce,
    });
  } catch (error) {
    console.error('Upload produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update produce details
// @route   PUT /api/farmers/produce/:id
// @access  Private (Farmer only)
exports.updateProduce = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const produce = db.produce.find((p) => p.id === req.params.id);
    if (!produce) return res.status(404).json({ success: false, message: 'Produce not found' });
    if (produce.farmerId !== farmerUser.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (produce.status !== 'available') return res.status(400).json({ success: false, message: 'Only available produce can be edited' });

    const allowed = ['cropName', 'cropType', 'quantity', 'unit', 'pricePerUnit', 'quality', 'description'];
    for (const k of allowed) {
      if (req.body[k] != null) produce[k] = req.body[k];
    }
    if (req.body.quantity != null) produce.quantity = Number(req.body.quantity);
    if (req.body.pricePerUnit != null) produce.pricePerUnit = Number(req.body.pricePerUnit);
    saveAll();

    res.status(200).json({
      success: true,
      message: 'Produce updated successfully',
      data: produce,
    });
  } catch (error) {
    console.error('Update produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete produce
// @route   DELETE /api/farmers/produce/:id
// @access  Private (Farmer only)
exports.deleteProduce = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const idx = db.produce.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Produce not found' });
    const produce = db.produce[idx];
    if (produce.farmerId !== farmerUser.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (produce.status !== 'available') return res.status(400).json({ success: false, message: 'Cannot delete produce that is not available' });
    db.produce.splice(idx, 1);
    saveAll();

    res.status(200).json({
      success: true,
      message: 'Produce deleted successfully',
    });
  } catch (error) {
    console.error('Delete produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all produce by farmer
// @route   GET /api/farmers/produce
// @access  Private (Farmer only)
exports.getMyProduce = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const produce = db.produce
      .filter((p) => p.farmerId === farmerUser.id)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    res.status(200).json({
      success: true,
      count: produce.length,
      data: produce,
    });
  } catch (error) {
    console.error('Get produce error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get nearby retailers
// @route   GET /api/farmers/nearby-retailers
// @access  Private (Farmer only)
exports.getNearbyRetailers = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });
    const region = farmerUser.region;

    res.status(200).json({
      success: true,
      count: db.users.filter((u) => u.role === 'retailer' && u.region === region).length,
      data: db.users
        .filter((u) => u.role === 'retailer' && u.region === region && u.id !== farmerUser.id)
        .slice(0, 20)
        .map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          region: u.region,
          profile: u.profile || {},
        })),
    });
  } catch (error) {
    console.error('Get nearby retailers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Assign produce to a ripening agent
// @route   PUT /api/farmers/produce/:id/assign-agent
// @access  Private (Farmer only)
exports.assignAgent = async (req, res) => {
  try {
    const farmerUser = db.users.find((u) => u.id === req.user.id && u.role === 'farmer');
    if (!farmerUser) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const { agentId } = req.body;
    if (!agentId) return res.status(400).json({ success: false, message: 'agentId is required' });

    const agentUser = db.users.find((u) => u.id === agentId && u.role === 'agent');
    if (!agentUser) return res.status(404).json({ success: false, message: 'Agent not found' });

    const produce = db.produce.find((p) => p.id === req.params.id);
    if (!produce) return res.status(404).json({ success: false, message: 'Produce not found' });
    if (produce.farmerId !== farmerUser.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (produce.status !== 'available') return res.status(400).json({ success: false, message: 'Only available produce can be assigned' });

    produce.agentId = agentUser.id;
    produce.ripeningStatus = 'pending';
    produce.status = 'at_agent';
    saveAll();

    res.status(200).json({
      success: true,
      message: 'Produce assigned to agent',
      data: { produce, agent: { id: agentUser.id, firstName: agentUser.firstName, lastName: agentUser.lastName, profile: agentUser.profile || {} } },
    });
  } catch (error) {
    console.error('Assign agent error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
