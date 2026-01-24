/**
 * Order Model
 * Stores order details between retailers and farmers
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  produceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true,
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'at_agent', 'ripening', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  // Agent assignment
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },
  assignedToAgentAt: {
    type: Date,
    default: null,
  },
  // Delivery information
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  expectedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

orderSchema.index({ retailerId: 1 });
orderSchema.index({ farmerId: 1 });
orderSchema.index({ agentId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
