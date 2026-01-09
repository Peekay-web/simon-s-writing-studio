const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   GET /api/blog
// @desc    Get published blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 6, category, tag } = req.query;
    
    const where = { isPublished: true };
    if (category) where.category = category;
    if (tag) where.tags = { [Op.contains]: [tag] };

    const offset = (page - 1) * limit;
    const { count, rows: blogs } = await Blog.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['name']
      }],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['content'] }
    });

    res.json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      where: { 
        slug: req.params.slug, 
        isPublished: true 
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['name']
      }]
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blog/admin/all
// @desc    Get all blog posts (Admin only)
// @access  Private
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const where = {};
    if (status === 'published') where.isPublished = true;
    if (status === 'draft') where.isPublished = false;

    const offset = (page - 1) * limit;
    const { count, rows: blogs } = await Blog.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blog
// @desc    Create new blog post (Admin only)
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('excerpt').trim().isLength({ min: 10, max: 300 }),
  body('content').trim().isLength({ min: 50 }),
  body('category').isIn(['writing-tips', 'academic', 'business', 'personal', 'industry-news', 'tutorials']),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, excerpt, content, category, tags, isPublished, featuredImage } = req.body;

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      isPublished: isPublished || false,
      featuredImage,
      authorId: req.user.id
    });

    const blogWithAuthor = await Blog.findByPk(blog.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['name']
      }]
    });

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: blogWithAuthor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post (Admin only)
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('excerpt').optional().trim().isLength({ min: 10, max: 300 }),
  body('content').optional().trim().isLength({ min: 50 }),
  body('category').optional().isIn(['writing-tips', 'academic', 'business', 'personal', 'industry-news', 'tutorials']),
  body('tags').optional().isArray(),
  body('isPublished').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findByPk(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        blog[key] = req.body[key];
      }
    });

    await blog.save();
    
    const blogWithAuthor = await Blog.findByPk(blog.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['name']
      }]
    });

    res.json({
      message: 'Blog post updated successfully',
      blog: blogWithAuthor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await blog.destroy();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blog/upload-image
// @desc    Upload image for blog post (Admin only)
// @access  Private
router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/blog/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;