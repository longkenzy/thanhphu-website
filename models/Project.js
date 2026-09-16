const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
    required: true,
    default: 'xay-lap',
    enum: ['xay-lap', 'noi-that', 'nhom-kinh', 'ha-tang']
  },
  categoryName: {
    type: String,
    default: 'Thi công xây lắp'
  },
  badge: {
    type: String,
    default: 'Xây Lắp Dân Dụng'
  },
  status: {
    type: String,
    default: 'Đã Bàn Giao'
  },
  image: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  gallery: [{
    type: String
  }],
  location: {
    type: String,
    default: ''
  },
  client: {
    type: String,
    default: ''
  },
  scale: {
    type: String,
    default: ''
  },
  contractType: {
    type: String,
    default: ''
  },
  timeline: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: '2024'
  },
  overview: {
    type: String,
    default: ''
  },
  scope: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  content: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
