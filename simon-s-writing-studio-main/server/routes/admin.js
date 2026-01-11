const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'uploads/profile';
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for profile images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'));
    }
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard overview
// @access  Private (Admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get counts
    const totalPortfolios = await Portfolio.count();
    const publishedPortfolios = await Portfolio.count({ where: { isPublished: true } });
    const pendingTestimonials = await Testimonial.count({ where: { isApproved: false } });
    const totalTestimonials = await Testimonial.count({ where: { isApproved: true } });

    // Get recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentViews = await Analytics.count({
      where: {
        type: 'page_view',
        createdAt: { [Op.gte]: weekAgo }
      }
    });

    const recentPortfolioViews = await Analytics.count({
      where: {
        type: 'portfolio_view',
        createdAt: { [Op.gte]: weekAgo }
      }
    });

    // Get latest testimonials
    const latestTestimonials = await Testimonial.findAll({
      where: { isApproved: false },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['name', 'rating', 'statement', 'projectType', 'createdAt']
    });

    // Get most viewed portfolios
    const topPortfolios = await Portfolio.findAll({
      where: { isPublished: true },
      order: [['views', 'DESC']],
      limit: 5,
      attributes: ['title', 'views', 'category', 'createdAt']
    });

    res.json({
      stats: {
        totalPortfolios,
        publishedPortfolios,
        pendingTestimonials,
        totalTestimonials,
        recentViews,
        recentPortfolioViews
      },
      latestTestimonials,
      topPortfolios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/portfolio
// @desc    Get all portfolio items for admin (including unpublished)
// @access  Private (Admin only)
router.get('/portfolio', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    
    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
    }

    const offset = (page - 1) * limit;
    const { count, rows: portfolios } = await Portfolio.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      portfolios,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private (Admin only)
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { email } = req.body;

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email already exists
      const existingUser = await User.findOne({ 
        where: { 
          email, 
          id: { [Op.ne]: user.id } 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if exists
      if (user.profileImage) {
        try {
          await fs.unlink(user.profileImage);
        } catch (err) {
          console.log('Old profile image not found:', err.message);
        }
      }
      user.profileImage = req.file.path;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/password
// @desc    Change admin password
// @access  Private (Admin only)
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findByPk(req.user.id);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/portfolio/reorder
// @desc    Reorder portfolio items
// @access  Private (Admin only)
router.post('/portfolio/reorder', auth, async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    // Update order for each item
    const updatePromises = items.map(item => 
      Portfolio.update({ order: item.order }, { where: { id: item.id } })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Portfolio order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;