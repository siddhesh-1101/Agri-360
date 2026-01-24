/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */

const bcrypt = require('bcryptjs');
const { db, saveAll, generateId } = require('../data/store');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register/:role
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address, region, role, profile } = req.body;
    const roleParam = req.params.role || role;

    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, firstName, lastName, phone',
      });
    }

    // Check if user already exists
    const userExists = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Validate role
    const validRoles = ['farmer', 'retailer', 'agent'];
    if (!validRoles.includes(roleParam)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: farmer, retailer, agent',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      id: generateId('u'),
      email: String(email).toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      phone,
      role: roleParam,
      region: region || 'Unknown',
      address: address || {},
      profile: profile || {},
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    saveAll();

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          region: user.region,
          address: user.address,
        },
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          region: user.region,
          address: user.address,
        },
        profile: user.profile || {},
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          region: user.region,
          address: user.address,
        },
        profile: user.profile || {},
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
