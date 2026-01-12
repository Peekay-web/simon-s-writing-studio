const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Testimonial = require('../models/Testimonial');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get approved testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    const where = { isApproved: true };
    if (rating) {
      where.rating = parseInt(rating);
    }

    const offset = (page - 1) * limit;

    const { count, rows: testimonials } = await Testimonial.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate stats
    const statsResult = await Testimonial.findAll({
      where: { isApproved: true },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalCount']
      ],
      raw: true
    });

    const countsByRating = await Testimonial.findAll({
      where: { isApproved: true },
      attributes: ['rating', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['rating'],
      raw: true
    });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    countsByRating.forEach(c => {
      distribution[c.rating] = c.count;
    });

    res.json({
      testimonials,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      stats: {
        averageRating: statsResult[0]?.avgRating ? Math.round(statsResult[0].avgRating * 10) / 10 : 0,
        totalReviews: count,
        distribution
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/testimonials
// @desc    Submit new testimonial
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('status').trim().isLength({ min: 2, max: 100 }).escape(),
  body('career').trim().isLength({ min: 2, max: 100 }).escape(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('statement').trim().isLength({ min: 10, max: 1000 }).escape(),
  body('projectType').isIn(['research', 'academic', 'content', 'copywriting', 'consulting', 'editing'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, status, career, rating, statement, projectType } = req.body;

    // Check for duplicate submissions (same email within 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingTestimonial = await Testimonial.findOne({
      where: {
        email,
        createdAt: {
          [Op.gt]: dayAgo
        }
      }
    });

    if (existingTestimonial) {
      return res.status(429).json({
        message: 'You can only submit one testimonial per day'
      });
    }

    const testimonial = await Testimonial.create({
      name,
      email,
      status,
      career,
      rating: parseInt(rating),
      statement,
      projectType,
      isApproved: true, // Auto-approve for simplicity
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      message: 'Testimonial submitted successfully! Thank you for your feedback.',
      testimonial
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/testimonials/pending
// @desc    Get pending testimonials (Admin only)
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: testimonials } = await Testimonial.findAndCountAll({
      where: { isApproved: false },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      testimonials,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/testimonials/:id/approve
// @desc    Approve testimonial (Admin only)
// @access  Private
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.update({
      isApproved: true,
      approvedAt: new Date()
    });

    res.json({ message: 'Testimonial approved successfully', testimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.destroy();
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;