/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

const jwt = require('jsonwebtoken');
const { db } = require('../data/store');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please provide a token.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_change_me');

    // Get user from token
    const user = db.users.find((u) => u.id === decoded.id);
    req.user = user ? { ...user, passwordHash: undefined } : null;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found with this token.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid token.',
    });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

// Check if user is farmer
exports.isFarmer = (req, res, next) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Farmer role required.',
    });
  }
  next();
};

// Check if user is retailer
exports.isRetailer = (req, res, next) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Retailer role required.',
    });
  }
  next();
};

// Check if user is agent
exports.isAgent = (req, res, next) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Agent role required.',
    });
  }
  next();
};
