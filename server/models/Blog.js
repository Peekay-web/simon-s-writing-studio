const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('writing-tips', 'academic', 'business', 'personal', 'industry-news', 'tutorials'),
    allowNull: false
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  readTime: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'blogs',
  hooks: {
    beforeSave: (blog) => {
      // Generate slug from title
      if (blog.changed('title')) {
        blog.slug = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
      
      // Set published date
      if (blog.changed('isPublished') && blog.isPublished && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
      
      // Calculate read time
      if (blog.changed('content')) {
        const wordsPerMinute = 200;
        const wordCount = blog.content.split(/\s+/).length;
        blog.readTime = Math.ceil(wordCount / wordsPerMinute);
      }
    }
  },
  indexes: [
    {
      fields: ['isPublished', 'publishedAt']
    },
    {
      fields: ['slug']
    },
    {
      fields: ['category', 'isPublished']
    }
  ]
});

module.exports = Blog;