const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
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
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  
  res.json({ 
    status: 'OK', 
    timestamp,
    uptime: `${Math.floor(uptime / 60)} minutes`,
    environment: process.env.NODE_ENV || 'development',
    message: 'Server is running and healthy'
  });
});

// Simple ping endpoint for external monitoring
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
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
  
  // Enhanced keep-alive mechanism for Render free tier
  if (process.env.NODE_ENV === 'production') {
    const keepAlive = () => {
      const timestamp = new Date().toISOString();
      console.log(`🔄 Keep-alive ping at ${timestamp}`);
      
      // Make a self-request to keep the service active
      const selfUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      
      // Use native fetch (available in Node.js 18+)
      fetch(`${selfUrl}/api/health`)
        .then(response => {
          if (response.ok) {
            console.log('✅ Self-ping successful');
          } else {
            console.log('⚠️ Self-ping failed with status:', response.status);
          }
        })
        .catch(error => {
          console.log('❌ Self-ping error:', error.message);
        });
    };
    
    // Initial ping after 30 seconds
    setTimeout(keepAlive, 30000);
    
    // Ping every 5 minutes to prevent sleeping (more frequent than 15 min timeout)
    setInterval(keepAlive, 5 * 60 * 1000);
    console.log('⏰ Enhanced keep-alive mechanism started (5 min intervals with self-ping)');
  }
});