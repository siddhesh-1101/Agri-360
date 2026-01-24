/**
 * Retailer Model
 * Extended user schema specific to retailers
 */

const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: [true, 'Please provide store name'],
    trim: true,
  },
  storeType: {
    type: String,
    enum: ['supermarket', 'grocery', 'wholesale', 'online', 'other'],
    default: 'grocery',
  },
  businessLicense: {
    type: String,
    trim: true,
  },
  preferredRegions: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

retailerSchema.index({ userId: 1 });

module.exports = mongoose.model('Retailer', retailerSchema);
