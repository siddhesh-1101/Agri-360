/**
 * Ripening Agent Model
 * Extended user schema specific to ripening agents
 */

const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  facilityName: {
    type: String,
    required: [true, 'Please provide facility name'],
    trim: true,
  },
  facilityCapacity: {
    type: Number, // in kg or tons
    default: 0,
  },
  facilityType: {
    type: String,
    enum: ['ripening', 'storage', 'both'],
    default: 'ripening',
  },
  certifications: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalProduceHandled: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

agentSchema.index({ userId: 1 });
agentSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Agent', agentSchema);
