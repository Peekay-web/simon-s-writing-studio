const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Portfolio = require('../models/Portfolio');
const Analytics = require('../models/Analytics');
const FileConverter = require('../services/fileConverter');
const CloudinaryService = require('../services/cloudinary');
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
      offset: parseInt(offset)
    });

    const portfolioList = portfolios.map(p => {
      const portfolioData = p.get({ plain: true });
      const hasFile = !!(portfolioData.file && (portfolioData.file.url || portfolioData.file.path || portfolioData.file.filename));
      delete portfolioData.file;
      return { ...portfolioData, hasFile };
    });

    res.json({
      portfolios: portfolioList,
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
// @desc    View portfolio file (rich preview with conversion)
// @access  Public
router.get('/:id/view', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio || !portfolio.isPublished || !portfolio.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileInfo = portfolio.file;
    const fileSource = fileInfo.url || (fileInfo.path ? path.join(__dirname, '..', fileInfo.path) : null);
    const fileType = FileConverter.getFileType(fileInfo.originalName || fileInfo.filename || 'unknown');

    if (!fileSource) {
      return res.status(404).json({ message: 'File source not found' });
    }

    // If it's a PDF and they want the actual PDF file, they can use another route
    // But here we want the rich preview data

    try {
      const convertedData = await FileConverter.convertFile(fileSource);
      res.json({
        fileType: convertedData.type,
        originalName: portfolio.file.originalName,
        data: convertedData.data
      });
    } catch (conversionError) {
      console.error('File conversion error:', conversionError);

      // Fallback: If it's a PDF, we tell the frontend to use the raw file in an iframe
      if (fileType === 'pdf') {
        return res.json({
          fileType: 'pdf-raw',
          originalName: portfolio.file.originalName,
          url: `/api/portfolio/${portfolio.id}/file`
        });
      }

      res.status(500).json({ message: 'Conversion failed', error: conversionError.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/:id/file
// @desc    Get portfolio file directly (Public if published)
// @access  Public
router.get('/:id/file', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);

    if (!portfolio || (!portfolio.isPublished && !req.headers.authorization)) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (!portfolio.file) {
      return res.status(404).json({ message: 'No file attached to this project' });
    }

    if (portfolio.file.url) {
      return res.redirect(portfolio.file.url);
    }

    const filePath = path.join(__dirname, '..', portfolio.file.path);
    res.setHeader('Content-Type', portfolio.file.mimetype);
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
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
      const uploadResult = await CloudinaryService.uploadFile(file.path, 'portfolio');
      portfolioData.file = {
        originalName: uploadResult.originalName,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        mimetype: file.mimetype,
        size: uploadResult.size
      };
    }

    // Handle custom thumbnail
    if (req.files && req.files.thumbnail) {
      const thumbnail = req.files.thumbnail[0];
      const uploadResult = await CloudinaryService.uploadFile(thumbnail.path, 'thumbnails');
      portfolioData.customThumbnail = uploadResult.url;
      portfolioData.thumbnailPublicId = uploadResult.publicId;
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

    if (tags) {
      portfolio.tags = JSON.parse(tags);
      portfolio.changed('tags', true);
    }

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
      // Delete old file from Cloudinary if exists
      if (portfolio.file && portfolio.file.publicId) {
        await CloudinaryService.deleteFile(portfolio.file.publicId);
      } else if (portfolio.file && portfolio.file.path) {
        // Fallback for local files
        try {
          await fs.unlink(portfolio.file.path);
        } catch (err) {
          console.log('Old local file not found:', err.message);
        }
      }

      const file = req.files.file[0];
      const uploadResult = await CloudinaryService.uploadFile(file.path, 'portfolio');
      portfolio.file = {
        originalName: uploadResult.originalName,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        mimetype: file.mimetype,
        size: uploadResult.size
      };
      portfolio.changed('file', true);
    }

    // Handle thumbnail updates
    if (req.files && req.files.thumbnail) {
      // Delete old thumbnail if exists
      if (portfolio.thumbnailPublicId) {
        await CloudinaryService.deleteFile(portfolio.thumbnailPublicId);
      } else if (portfolio.customThumbnail && !portfolio.customThumbnail.startsWith('http')) {
        // Fallback for local files
        try {
          await fs.unlink(portfolio.customThumbnail);
        } catch (err) {
          console.log('Old local thumbnail not found:', err.message);
        }
      }

      const thumbnail = req.files.thumbnail[0];
      const uploadResult = await CloudinaryService.uploadFile(thumbnail.path, 'thumbnails');
      portfolio.customThumbnail = uploadResult.url;
      portfolio.thumbnailPublicId = uploadResult.publicId;
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

    // Delete associated files from Cloudinary
    if (portfolio.file && portfolio.file.publicId) {
      await CloudinaryService.deleteFile(portfolio.file.publicId);
    } else if (portfolio.file && portfolio.file.path) {
      try {
        await fs.unlink(portfolio.file.path);
      } catch (err) {
        console.log('Local file not found during deletion:', err.message);
      }
    }

    if (portfolio.thumbnailPublicId) {
      await CloudinaryService.deleteFile(portfolio.thumbnailPublicId);
    } else if (portfolio.customThumbnail && !portfolio.customThumbnail.startsWith('http')) {
      try {
        await fs.unlink(portfolio.customThumbnail);
      } catch (err) {
        console.log('Local thumbnail not found during deletion:', err.message);
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