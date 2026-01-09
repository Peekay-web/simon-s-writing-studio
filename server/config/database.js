const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite database connected successfully');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('📊 Database models synchronized');
    
    // Create default admin user if none exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      const defaultAdmin = await User.create({
        email: process.env.ADMIN_EMAIL || 'PARAKLETOS@ADMINRG-CFKA0M4',
        password: process.env.ADMIN_PASSWORD || 'GODABEG',
        role: 'admin'
      });
      
      console.log('🔐 Default admin user created');
      console.log(`📧 Email: ${defaultAdmin.email}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'GODABEG'}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };