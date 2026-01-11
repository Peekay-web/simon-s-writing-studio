const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Audit logging function
const auditLog = (action, userId, details, ip) => {
  console.log(`[AUDIT] ${new Date().toISOString()} - User ${userId} performed ${action} from IP ${ip}: ${JSON.stringify(details)}`);
};

// Main auth middleware
const auth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is required');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify token with proper options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'simon-writing-studio',
      audience: 'admin-panel'
    });

    // Get user from database
    const user = await User.findByPk(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Add user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Log the authenticated request
    const clientIP = req.ip || req.connection.remoteAddress;
    auditLog('authenticated_request', user.id, {
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, clientIP);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    const clientIP = req.ip || req.connection.remoteAddress;
    auditLog('unauthorized_admin_access_attempt', req.user.id, {
      method: req.method,
      path: req.path
    }, clientIP);
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

module.exports = auth;
module.exports.requireAdmin = requireAdmin;
module.exports.auditLog = auditLog;