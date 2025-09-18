/**
 * backend/controllers/payments.controller.js
 * Razorpay integration controller.
 * - createOrder: create razorpay order and a Payment doc
 * - verifyPayment: verify signature after client-side success
 * - getHistory: fetch payment history (paginated)
 * - refundPayment: issue refund via Razorpay API
 * - webhook: handle razorpay webhooks (verifies signature using webhook secret)
 */

require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// nodemailer transport (configure via env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Optional Twilio client (if configured)
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('Twilio not configured properly:', err.message);
  }
}

async function addLog(paymentDoc, status, message, meta = {}) {
  paymentDoc.logs = paymentDoc.logs || [];
  paymentDoc.logs.push({ status, message, meta, createdAt: new Date() });
  return paymentDoc.save();
}

async function sendPaymentEmail(to, subject, html) {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'no-reply@example.com',
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Email error:', err.message || err);
  }
}

async function sendPaymentSMS(toNumber, message) {
  if (!twilioClient || !toNumber) return;
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber
    });
  } catch (err) {
    console.error('SMS error:', err.message || err);
  }
}

exports.createOrder = async (req, res) => {
  // validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { amount, currency = 'INR' } = req.body;
  if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const amountPaise = Math.round(Number(amount) * 100); // convert to paise

    const options = {
      amount: amountPaise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    const paymentDoc = await Payment.create({
      user: req.userId || null,
      orderId: order.id,
      amount: amountPaise,
      currency,
      status: 'created',
      rawResponse: order,
      logs: [{ status: 'created', message: 'Order created', meta: order }]
    });

    return res.json({ ok: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('createOrder error:', err.message || err);
    return res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Verify signature
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const expected = hmac.digest('hex');

  if (expected !== razorpay_signature) {
    // Mark as failed in DB
    const p = await Payment.findOneAndUpdate({ orderId: razorpay_order_id }, { status: 'failed', rawResponse: req.body }, { new: true });
    if (p) await addLog(p, 'failed', 'Signature verification failed', req.body);
    return res.status(400).json({ ok: false, message: 'Invalid signature' });
  }

  try {
    const paymentDoc = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid',
        method: req.body.method || undefined,
        rawResponse: req.body
      },
      { new: true }
    );

    if (paymentDoc) {
      await addLog(paymentDoc, 'paid', 'Payment verified and marked as paid', req.body);

      // Notify user
      if (paymentDoc.user) {
        try {
          const user = await User.findById(paymentDoc.user);
          if (user && user.email) {
            const html = `<p>Hi ${user.name || ''},</p><p>We received your payment of ${(paymentDoc.amount/100).toFixed(2)} ${paymentDoc.currency}. Transaction ID: ${razorpay_payment_id}</p>`;
            sendPaymentEmail(user.email, 'Payment Received', html);
          }
          if (user && user.phoneNumber) {
            sendPaymentSMS(String(user.phoneNumber), `Payment received: ${(paymentDoc.amount/100).toFixed(2)} ${paymentDoc.currency}. Txn:${razorpay_payment_id}`);
          }
        } catch (err) {
          console.error('Notify user error:', err.message || err);
        }
      }

      return res.json({ ok: true, payment: paymentDoc });
    } else {
      return res.status(404).json({ ok: false, message: 'Payment order not found' });
    }
  } catch (err) {
    console.error('verifyPayment error:', err.message || err);
    return res.status(500).json({ message: 'Server error verifying payment' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const query = {};
    if (req.userId) query.user = req.userId; // return only user's payments if authenticated
    const payments = await Payment.find(query).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page)-1)*Number(limit));
    return res.json({ ok: true, payments });
  } catch (err) {
    console.error('getHistory error:', err.message || err);
    return res.status(500).json({ message: 'Server error fetching payments' });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    if (!paymentId) return res.status(400).json({ message: 'Missing paymentId' });

    const payload = {};
    if (amount) payload.amount = Math.round(Number(amount) * 100);

    const refund = await razorpay.payments.refund(paymentId, payload);

    const paymentDoc = await Payment.findOneAndUpdate({ paymentId }, {
      status: 'refunded',
      refund: {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
        createdAt: new Date()
      },
      rawResponse: { refund }
    }, { new: true });

    if (paymentDoc) await addLog(paymentDoc, 'refunded', 'Refund processed', refund);

    return res.json({ ok: true, refund });
  } catch (err) {
    console.error('refundPayment error:', err.message || err);
    return res.status(500).json({ message: 'Server error processing refund', details: err.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-razorpay-signature'];
    const body = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');

    if (expected !== signature) {
      console.warn('Webhook signature mismatch');
      return res.status(400).json({ ok: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload || {};

    if (event === 'payment.captured' || event === 'payment.failed') {
      const paymentEntity = payload.payment && (payload.payment.entity || payload.payment);
      const orderId = paymentEntity && paymentEntity.order_id;
      const paymentId = paymentEntity && paymentEntity.id;
      const status = paymentEntity && paymentEntity.status;
      const doc = await Payment.findOneAndUpdate({ orderId }, {
        paymentId,
        status,
        rawResponse: paymentEntity
      }, { new: true });
      if (doc) await addLog(doc, status || event, `Webhook: ${event}`, paymentEntity);
    }

    // handle refunds (if needed)
    if (event === 'refund.processed' || event === 'refund.created') {
      const refundEntity = payload.refund && (payload.refund.entity || payload.refund);
      const paymentId = refundEntity && refundEntity.payment_id;
      const doc = await Payment.findOne({ paymentId });
      if (doc) {
        doc.refund = doc.refund || {};
        doc.refund.refundId = refundEntity.id;
        doc.refund.status = refundEntity.status;
        doc.refund.amount = refundEntity.amount;
        await addLog(doc, 'refund', `Webhook refund: ${event}`, refundEntity);
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Webhook handling error:', err.message || err);
    return res.status(500).json({ message: 'Server webhook error' });
  }
};
