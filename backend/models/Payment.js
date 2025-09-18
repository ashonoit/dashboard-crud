/**
 * backend/models/Payment.js
 * Payment schema to store orders, payments, refunds and logs.
 * Amounts are stored in the smallest currency unit (paise for INR).
 */

const mongoose = require('mongoose');

const PaymentLogSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  orderId: { type: String, index: true },
  paymentId: { type: String, index: true },
  signature: { type: String },
  amount: { type: Number, required: true }, // stored in paise (integer)
  currency: { type: String, default: 'INR' },
  method: { type: String },
  status: { type: String, enum: ['created','paid','failed','refunded','cancelled','pending'], default: 'created' },
  rawResponse: { type: Object },
  refund: {
    refundId: String,
    amount: Number,
    status: String,
    createdAt: Date
  },
  logs: [PaymentLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
