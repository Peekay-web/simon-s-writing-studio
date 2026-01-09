const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple in-memory storage for production (to avoid SQLite segfaults)
const inMemoryStorage = {
  users: [
    {
      id: 1,
      email: process.env.ADMIN_EMAIL || 'PARAKLETOS@ADMINRG-CFKA0M4',
      password: process.env.ADMIN_PASSWORD || 'GODABEG',
      role: 'admin'
    }
  ],
  portfolios: [
    {
      id: 1,
      title: 'Academic Research Paper',
      description: 'Comprehensive research on modern writing techniques',
      category: 'research',
      isPublished: true,
      views: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Business Content Strategy',
      description: 'Strategic content development for corporate clients',
      category: 'business',
      isPublished: true,
      views: 32,
      createdAt: new Date().toISOString()
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah@university.edu',
      status: 'Professor',
      career: 'Academic Research',
      rating: 5,
      statement: 'Exceptional writing quality and attention to detail. Highly recommended for academic projects.',
      projectType: 'research',
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@company.com',
      status: 'Marketing Director',
      career: 'Corporate Marketing',
      rating: 5,
      statement: 'Outstanding content creation that perfectly captured our brand voice.',
      projectType: 'content',
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ],
  blogs: [
    {
      id: 1,
      title: 'The Art of Academic Writing',
      slug: 'art-of-academic-writing',
      excerpt: 'Discover the key principles that make academic writing effective and engaging.',
      content: '<p>Academic writing requires precision, clarity, and rigorous research...</p>',
      category: 'academic',
      isPublished: true,
      views: 156,
      authorId: 1,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }
  ],
  analytics: []
};

// Make storage available globally
global.inMemoryStorage = inMemoryStorage;

console.log('✅ In-memory storage initialized');
console.log(`👤 Admin user: ${inMemoryStorage.users[0].email}`);
console.log(`📊 Sample data loaded: ${inMemoryStorage.portfolios.length} portfolios, ${inMemoryStorage.testimonials.length} testimonials`);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});