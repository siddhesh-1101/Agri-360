/**
 * Produce Model
 * Stores produce details uploaded by farmers
 */

const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cropName: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true,
  },
  cropType: {
    type: String,
    required: [true, 'Please provide crop type'],
    enum: ['fruit', 'vegetable', 'grain', 'other'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'ton', 'quintal', 'piece'],
    default: 'kg',
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please provide price per unit'],
    min: 0,
  },
  harvestDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  quality: {
    type: String,
    enum: ['premium', 'good', 'fair'],
    default: 'good',
  },
  description: {
    type: String,
    maxlength: 500,
  },
  images: [{
    type: String, // URLs to images
  }],
  status: {
    type: String,
    enum: ['available', 'ordered', 'in_transit', 'at_agent', 'ripening', 'delivered', 'sold'],
    default: 'available',
  },
  // Order details
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    default: null,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },
  // Ripening status (if assigned to agent)
  ripeningStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'ready', 'completed'],
    default: null,
  },
  ripeningStartDate: {
    type: Date,
    default: null,
  },
  ripeningEndDate: {
    type: Date,
    default: null,
  },
  location: {
    region: {
      type: String,
      index: true,
    },
  },
}, {
  timestamps: true,
});

produceSchema.index({ farmerId: 1 });
produceSchema.index({ retailerId: 1 });
produceSchema.index({ agentId: 1 });
produceSchema.index({ status: 1 });
produceSchema.index({ 'location.region': 1 });

module.exports = mongoose.model('Produce', produceSchema);
