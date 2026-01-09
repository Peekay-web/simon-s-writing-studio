const express = require('express');
const Analytics = require('../models/Analytics');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

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

    const analytics = new Analytics({
      type,
      page,
      portfolioId: portfolioId || null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      sessionId: req.sessionID || `anon-${Date.now()}`
    });

    await analytics.save();
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
    const totalViews = await Analytics.countDocuments({
      type: 'page_view',
      createdAt: { $gte: startDate }
    });

    // Unique visitors (based on IP)
    const uniqueVisitors = await Analytics.distinct('ipAddress', {
      createdAt: { $gte: startDate }
    });

    // Portfolio views
    const portfolioViews = await Analytics.countDocuments({
      type: 'portfolio_view',
      createdAt: { $gte: startDate }
    });

    // Contact form submissions
    const contactSubmissions = await Analytics.countDocuments({
      type: 'contact_form',
      createdAt: { $gte: startDate }
    });

    // Testimonial submissions
    const testimonialSubmissions = await Analytics.countDocuments({
      type: 'testimonial_submit',
      createdAt: { $gte: startDate }
    });

    // Daily views for chart
    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          type: 'page_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top pages
    const topPages = await Analytics.aggregate([
      {
        $match: {
          type: 'page_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$page',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Most viewed portfolio items
    const topPortfolios = await Analytics.aggregate([
      {
        $match: {
          type: 'portfolio_view',
          portfolioId: { $ne: null },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$portfolioId',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'portfolios',
          localField: '_id',
          foreignField: '_id',
          as: 'portfolio'
        }
      },
      {
        $project: {
          views: 1,
          title: { $arrayElemAt: ['$portfolio.title', 0] },
          category: { $arrayElemAt: ['$portfolio.category', 0] }
        }
      }
    ]);

    // Referrer analysis
    const topReferrers = await Analytics.aggregate([
      {
        $match: {
          referrer: { $ne: null, $ne: '' },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$referrer',
          visits: { $sum: 1 }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      summary: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        portfolioViews,
        contactSubmissions,
        testimonialSubmissions
      },
      charts: {
        dailyViews,
        topPages,
        topPortfolios,
        topReferrers
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

    const portfolioAnalytics = await Analytics.aggregate([
      {
        $match: {
          portfolioId: req.params.id,
          type: 'portfolio_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalViews = await Analytics.countDocuments({
      portfolioId: req.params.id,
      type: 'portfolio_view',
      createdAt: { $gte: startDate }
    });

    res.json({
      totalViews,
      dailyViews: portfolioAnalytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;