/**
 * Database Connection Check Middleware
 * Checks if MongoDB is connected before processing requests
 */

const mongoose = require('mongoose');

exports.checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    // Connection is open and ready
    next();
  } else if (mongoose.connection.readyState === 2) {
    // Connection is connecting
    return res.status(503).json({
      success: false,
      message: 'Database is connecting. Please try again in a moment.',
    });
  } else {
    // Connection is disconnected or failed
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please check your MongoDB connection.',
      error: 'MongoDB not connected',
    });
  }
};
