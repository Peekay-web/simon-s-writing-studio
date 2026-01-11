const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Track failed login attempts per IP
const failedAttempts = new Map();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', loginLimiter, [
  body('email').trim().notEmpty().withMessage('Email/Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check if IP is temporarily blocked
    const attempts = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    if (attempts.count >= 3 && Date.now() - attempts.lastAttempt < 300000) { // 5 minutes
      return res.status(429).json({ message: 'Account temporarily locked due to failed attempts' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Increment failed attempts
      failedAttempts.set(clientIP, { count: attempts.count + 1, lastAttempt: Date.now() });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      // Increment failed attempts
      failedAttempts.set(clientIP, { count: attempts.count + 1, lastAttempt: Date.now() });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Clear failed attempts on successful login
    failedAttempts.delete(clientIP);

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is required');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'simon-writing-studio',
      audience: 'admin-panel'
    });

    // Log successful login
    console.log(`[AUDIT] ${new Date().toISOString()} - User ${user.email} logged in from IP ${clientIP}`);

    // Set secure cookie instead of returning token in response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is required');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'simon-writing-studio',
      audience: 'admin-panel'
    });

    const user = await User.findByPk(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Log logout
    const clientIP = req.ip || req.connection.remoteAddress;
    console.log(`[AUDIT] ${new Date().toISOString()} - User logged out from IP ${clientIP}`);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;