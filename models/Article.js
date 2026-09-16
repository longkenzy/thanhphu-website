const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'tin-tuc',
    index: true
  },
  categoryName: {
    type: String,
    default: 'Tin Tức'
  },
  author: {
    type: String,
    default: 'Ban Truyền Thông Thành Phú'
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('vi-VN')
  },
  image: {
    type: String,
    default: 'assets/images/news-1.svg'
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  excerpt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // we manage createdAt and updatedAt explicitly for backward-compatibility with string ISO dates
});

// Full-text search index on title and excerpt
articleSchema.index({ title: 'text', excerpt: 'text', author: 'text', categoryName: 'text' });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
