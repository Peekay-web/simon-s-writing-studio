const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('page_view', 'portfolio_view', 'contact_form', 'testimonial_submit'),
    allowNull: false
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false
  },
  portfolioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'portfolios',
      key: 'id'
    }
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'analytics',
  indexes: [
    {
      fields: ['type', 'createdAt']
    },
    {
      fields: ['page', 'createdAt']
    },
    {
      fields: ['sessionId']
    }
  ]
});

module.exports = Analytics;