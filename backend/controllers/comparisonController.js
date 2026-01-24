/**
 * Comparison Controller
 * Handles comparison of nearby users based on geolocation/region
 */

const { db } = require('../data/store');

// @desc    Compare nearby users (farmers vs retailers in same region)
// @route   GET /api/compare/nearby
// @access  Private
exports.compareNearby = async (req, res) => {
  try {
    const userRegion = req.user.region;

    if (!userRegion) {
      return res.status(400).json({
        success: false,
        message: 'User location region not set. Please update your profile.',
      });
    }

    const { role1 = 'farmer', role2 = 'retailer' } = req.query;
    const validRoles = ['farmer', 'retailer', 'agent'];

    if (!validRoles.includes(role1) || !validRoles.includes(role2)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid roles. Must be one of: farmer, retailer, agent',
      });
    }

    const users1 = db.users
      .filter((u) => u.role === role1 && u.region === userRegion && u.id !== req.user.id)
      .slice(0, 20)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, region: u.region, profile: u.profile || {} }));

    const users2 = db.users
      .filter((u) => u.role === role2 && u.region === userRegion && u.id !== req.user.id)
      .slice(0, 20)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, region: u.region, profile: u.profile || {} }));

    const statsForRole = (role, users) => {
      if (role === 'farmer') {
        const farmerIds = users.map((u) => u.id);
        const totalProduce = db.produce.filter((p) => farmerIds.includes(p.farmerId)).length;
        return { totalUsers: users.length, totalProduce };
      }
      if (role === 'retailer') {
        const retailerIds = users.map((u) => u.id);
        const totalOrders = db.orders.filter((o) => retailerIds.includes(o.retailerId)).length;
        return { totalUsers: users.length, totalOrders };
      }
      if (role === 'agent') {
        const agentIds = users.map((u) => u.id);
        const assignedProduce = db.produce.filter((p) => p.agentId && agentIds.includes(p.agentId)).length;
        return { totalUsers: users.length, assignedProduce };
      }
      return { totalUsers: users.length };
    };

    const stats1 = statsForRole(role1, users1);
    const stats2 = statsForRole(role2, users2);

    res.status(200).json({
      success: true,
      data: {
        region: userRegion,
        comparison: {
          [role1]: {
            users: users1,
            stats: stats1,
          },
          [role2]: {
            users: users2,
            stats: stats2,
          },
        },
      },
    });
  } catch (error) {
    console.error('Compare nearby error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get nearby users by role
// @route   GET /api/compare/nearby/:role
// @access  Private
exports.getNearbyByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const userRegion = req.user.region;

    if (!userRegion) {
      return res.status(400).json({
        success: false,
        message: 'User location region not set. Please update your profile.',
      });
    }

    const validRoles = ['farmer', 'retailer', 'agent'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: farmer, retailer, agent',
      });
    }

    const users = db.users
      .filter((u) => u.role === role && u.region === userRegion && u.id !== req.user.id)
      .slice(0, 50)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, region: u.region, profile: u.profile || {} }));

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        region: userRegion,
        role,
        users,
      },
    });
  } catch (error) {
    console.error('Get nearby by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
