const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Portfolio = require('../models/Portfolio');
const Analytics = require('../models/Analytics');
const FileConverter = require('../services/fileConverter');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'uploads/portfolio';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for Office files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|ppt|pptx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument|application\/vnd\.ms-/.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, Word documents, PowerPoint, and Excel files are allowed'));
    }
  }
});

// @route   GET /api/portfolio
// @desc    Get all published portfolio items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const where = { isPublished: true };
    if (category && category !== 'all') {
      where.category = category;
    }

    const offset = (page - 1) * limit;

    const { count, rows: portfolios } = await Portfolio.findAndCountAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['file'] } // Don't expose file paths to public
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

// @route   GET /api/portfolio/:id
// @desc    Get single portfolio item and increment views
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio || !portfolio.isPublished) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Increment views
    await portfolio.increment('views');

    // Track analytics
    await Analytics.create({
      type: 'portfolio_view',
      page: `/portfolio/${portfolio.id}`,
      portfolioId: portfolio.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      sessionId: req.sessionID || 'anonymous'
    });

    // Return portfolio without file path for security
    const portfolioData = portfolio.toJSON();
    const hasFile = !!portfolioData.file;
    delete portfolioData.file;

    res.json({
      ...portfolioData,
      hasFile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/:id/view
// @desc    View portfolio file (secure viewing with conversion)
// @access  Public
router.get('/:id/view', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio || !portfolio.isPublished || !portfolio.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', portfolio.file.path);
    const fileType = FileConverter.getFileType(portfolio.file.filename);

    // For PDF files, serve directly
    if (fileType === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.sendFile(filePath);
    }

    // For Office files, convert and return JSON
    try {
      const convertedData = await FileConverter.convertFile(filePath);
      res.json({
        fileType: convertedData.type,
        originalName: portfolio.file.originalName,
        data: convertedData.data
      });
    } catch (conversionError) {
      console.error('File conversion error:', conversionError);
      // Fallback: try to serve the original file
      res.setHeader('Content-Type', portfolio.file.mimetype);
      res.setHeader('Content-Disposition', 'inline');
      res.sendFile(filePath);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/:id/download
// @desc    Download original file (Admin only)
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio || !portfolio.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', portfolio.file.path);

    res.setHeader('Content-Type', portfolio.file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${portfolio.file.originalName}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/portfolio
// @desc    Create new portfolio item (Admin only)
// @access  Private
router.post('/', auth, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, tags, isPublished } = req.body;

    const portfolioData = {
      title,
      description,
      category,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: isPublished === 'true'
    };

    // Handle main file upload
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      portfolioData.file = {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      };
    }

    // Handle custom thumbnail
    if (req.files && req.files.thumbnail) {
      const thumbnail = req.files.thumbnail[0];
      portfolioData.customThumbnail = thumbnail.path;
    }

    if (portfolioData.isPublished) {
      portfolioData.publishedAt = new Date();
    }

    // Set authorId if available in request (from auth middleware)
    if (req.user && req.user.id) {
      portfolioData.authorId = req.user.id;
    }

    const portfolio = await Portfolio.create(portfolioData);

    res.status(201).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item (Admin only)
// @access  Private
router.put('/:id', auth, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    const { title, description, category, tags, isPublished } = req.body;

    // Update basic fields
    if (title) portfolio.title = title;
    if (description) portfolio.description = description;
    if (category) portfolio.category = category;
    if (tags) portfolio.tags = JSON.parse(tags);

    // Handle publishing status
    if (isPublished !== undefined) {
      const wasPublished = portfolio.isPublished;
      portfolio.isPublished = isPublished === 'true';

      if (!wasPublished && portfolio.isPublished) {
        portfolio.publishedAt = new Date();
      }
    }

    // Handle file updates
    if (req.files && req.files.file) {
      // Delete old file if exists
      if (portfolio.file && portfolio.file.path) {
        try {
          await fs.unlink(portfolio.file.path);
        } catch (err) {
          console.log('Old file not found:', err.message);
        }
      }

      const file = req.files.file[0];
      portfolio.file = {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      };
    }

    // Handle thumbnail updates
    if (req.files && req.files.thumbnail) {
      // Delete old thumbnail if exists
      if (portfolio.customThumbnail) {
        try {
          await fs.unlink(portfolio.customThumbnail);
        } catch (err) {
          console.log('Old thumbnail not found:', err.message);
        }
      }

      portfolio.customThumbnail = req.files.thumbnail[0].path;
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/portfolio/:id
// @desc    Delete portfolio item (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Delete associated files
    if (portfolio.file && portfolio.file.path) {
      try {
        await fs.unlink(portfolio.file.path);
      } catch (err) {
        console.log('File not found:', err.message);
      }
    }

    if (portfolio.customThumbnail) {
      try {
        await fs.unlink(portfolio.customThumbnail);
      } catch (err) {
        console.log('Thumbnail not found:', err.message);
      }
    }

    await portfolio.destroy();
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;