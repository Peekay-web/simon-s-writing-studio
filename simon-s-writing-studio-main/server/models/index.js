const User = require('./User');
const Portfolio = require('./Portfolio');
const Blog = require('./Blog');
const Testimonial = require('./Testimonial');
const Analytics = require('./Analytics');

// Define associations
User.hasMany(Portfolio, { foreignKey: 'authorId', as: 'portfolios' });
Portfolio.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Portfolio.hasMany(Analytics, { foreignKey: 'portfolioId', as: 'analytics' });
Analytics.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

module.exports = {
  User,
  Portfolio,
  Blog,
  Testimonial,
  Analytics
};