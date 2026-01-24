/**
 * Farmer Model
 * Extended user schema specific to farmers
 */

const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  farmName: {
    type: String,
    required: [true, 'Please provide farm name'],
    trim: true,
  },
  farmSize: {
    type: Number, // in acres
    default: 0,
  },
  crops: [{
    cropName: String,
    cropType: String,
    plantingDate: Date,
    expectedHarvestDate: Date,
  }],
  certifications: [{
    type: String,
  }],
  bio: {
    type: String,
    maxlength: 500,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalProduce: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

farmerSchema.index({ userId: 1 });

module.exports = mongoose.model('Farmer', farmerSchema);
