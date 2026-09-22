const mongoose = require('mongoose');

// Schema for Strategic Partners & Investors (Chủ đầu tư & Đối tác chiến lược)
const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true,
    trim: true
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: '',
    trim: true
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

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
