const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Determine database storage path
let dbPath;
if (process.env.NODE_ENV === 'production') {
  // Use /tmp directory in production (writable on Render)
  dbPath = '/tmp/database.sqlite';
} else {
  // Use local directory in development
  dbPath = path.join(__dirname, '..', 'database.sqlite');
}

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    console.log(`🔗 Connecting to SQLite database at: ${dbPath}`);

    // Test basic connection first
    await sequelize.authenticate();
    console.log('✅ SQLite database connected successfully');

    // Only sync in development or if explicitly requested
    if (process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_SYNC === 'true') {
      await sequelize.sync({ alter: false });
      console.log('📊 Database models synchronized');
    }

    // Delay admin user creation to avoid startup issues
    setTimeout(async () => {
      try {
        const User = require('../models/User');
        const adminExists = await User.findOne({ where: { role: 'admin' } });

        if (!adminExists) {
          const defaultAdmin = await User.create({
            username: process.env.ADMIN_USERNAME || 'PK KONCEPTS',
            password: process.env.ADMIN_PASSWORD || 'Ndifreke',
            role: 'admin'
          });

          console.log('🔐 Default admin user created');
          console.log(`👤 Username: ${defaultAdmin.username}`);
        } else {
          console.log('👤 Admin user already exists');
        }
      } catch (userError) {
        console.warn('⚠️ Admin user creation failed:', userError.message);
      }
    }, 2000); // Wait 2 seconds after startup

  } catch (error) {
    console.error('❌ Database connection failed:', error);

    // In production, continue without database
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Continuing without database in production mode');
      return;
    }

    throw error;
  }
};

module.exports = { sequelize, connectDB };