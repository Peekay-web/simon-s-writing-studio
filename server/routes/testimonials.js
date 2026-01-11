const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get approved testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    
    let testimonials = global.inMemoryStorage.testimonials.filter(t => t.isApproved);
    
    if (rating) {
      testimonials = testimonials.filter(t => t.rating === parseInt(rating));
    }

    // Sort by creation date (newest first)
    testimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const offset = (page - 1) * limit;
    const paginatedTestimonials = testimonials.slice(offset, offset + parseInt(limit));

    // Calculate stats
    const totalReviews = testimonials.length;
    const averageRating = totalReviews > 0 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews 
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    testimonials.forEach(t => {
      distribution[t.rating]++;
    });

    res.json({
      testimonials: paginatedTestimonials.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status,
        career: t.career,
        rating: t.rating,
        statement: t.statement,
        projectType: t.projectType,
        createdAt: t.createdAt
      })),
      totalPages: Math.ceil(testimonials.length / limit),
      currentPage: parseInt(page),
      total: testimonials.length,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
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
    const existingTestimonial = global.inMemoryStorage.testimonials.find(t => 
      t.email === email && new Date(t.createdAt) > dayAgo
    );

    if (existingTestimonial) {
      return res.status(429).json({ 
        message: 'You can only submit one testimonial per day' 
      });
    }

    const testimonial = {
      id: Date.now(),
      name,
      email,
      status,
      career,
      rating: parseInt(rating),
      statement,
      projectType,
      isApproved: true, // Auto-approve for simplicity
      createdAt: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    global.inMemoryStorage.testimonials.push(testimonial);

    res.status(201).json({ 
      message: 'Testimonial submitted successfully! Thank you for your feedback.',
      testimonial: {
        id: testimonial.id,
        name: testimonial.name,
        status: testimonial.status,
        career: testimonial.career,
        rating: testimonial.rating,
        statement: testimonial.statement,
        projectType: testimonial.projectType,
        createdAt: testimonial.createdAt
      }
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

    const pendingTestimonials = global.inMemoryStorage.testimonials.filter(t => !t.isApproved);
    
    // Pagination
    const offset = (page - 1) * limit;
    const paginatedTestimonials = pendingTestimonials.slice(offset, offset + parseInt(limit));

    res.json({
      testimonials: paginatedTestimonials,
      totalPages: Math.ceil(pendingTestimonials.length / limit),
      currentPage: parseInt(page),
      total: pendingTestimonials.length
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
    const testimonial = global.inMemoryStorage.testimonials.find(t => t.id === parseInt(req.params.id));
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.isApproved = true;
    testimonial.approvedAt = new Date().toISOString();

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
    const index = global.inMemoryStorage.testimonials.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    global.inMemoryStorage.testimonials.splice(index, 1);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;