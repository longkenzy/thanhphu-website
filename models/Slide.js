const mongoose = require('mongoose');

// Schema for individual hero slide
const slideSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    trim: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
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

// Schema for global slide settings (e.g. autoplay speed)
const slideSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'hero_slider'
  },
  autoplaySpeed: {
    type: Number,
    default: 6, // 6 seconds
    min: 2,
    max: 30
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Slide = mongoose.model('Slide', slideSchema);
const SlideSetting = mongoose.model('SlideSetting', slideSettingSchema);

module.exports = { Slide, SlideSetting };
