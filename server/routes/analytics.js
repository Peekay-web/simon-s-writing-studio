const express = require('express');
const Analytics = require('../models/Analytics');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   POST /api/analytics/track
// @desc    Track page view or event
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const { type, page, portfolioId } = req.body;

    if (!type || !page) {
      return res.status(400).json({ message: 'Type and page are required' });
    }

    const analytics = await Analytics.create({
      type,
      page,
      portfolioId: portfolioId || null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      sessionId: req.sessionID || `anon-${Date.now()}`
    });

    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get analytics dashboard data (Admin only)
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Total page views
    const totalViews = await Analytics.count({
      where: {
        type: 'page_view',
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Unique visitors (based on IP)
    const uniqueVisitors = await Analytics.findAll({
      attributes: ['ipAddress'],
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      group: ['ipAddress']
    });

    // Portfolio views
    const portfolioViews = await Analytics.count({
      where: {
        type: 'portfolio_view',
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Contact form submissions
    const contactSubmissions = await Analytics.count({
      where: {
        type: 'contact_form',
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Testimonial submissions
    const testimonialSubmissions = await Analytics.count({
      where: {
        type: 'testimonial_submit',
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Simple stats for now (can be enhanced with more complex queries later)
    const topPages = await Analytics.findAll({
      attributes: [
        'page',
        [Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('page')), 'views']
      ],
      where: {
        type: 'page_view',
        createdAt: { [Op.gte]: startDate }
      },
      group: ['page'],
      order: [[Analytics.sequelize.fn('COUNT', Analytics.sequelize.col('page')), 'DESC']],
      limit: 10,
      raw: true
    });

    res.json({
      summary: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        portfolioViews,
        contactSubmissions,
        testimonialSubmissions
      },
      charts: {
        topPages: topPages.map(page => ({
          _id: page.page,
          views: parseInt(page.views)
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/portfolio/:id
// @desc    Get analytics for specific portfolio item (Admin only)
// @access  Private
router.get('/portfolio/:id', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const totalViews = await Analytics.count({
      where: {
        portfolioId: req.params.id,
        type: 'portfolio_view',
        createdAt: { [Op.gte]: startDate }
      }
    });

    res.json({
      totalViews,
      dailyViews: [] // Simplified for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;