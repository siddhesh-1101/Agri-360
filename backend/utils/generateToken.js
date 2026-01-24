/**
 * Generate JWT Token
 * Utility function to create JWT tokens for authenticated users
 */

const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
