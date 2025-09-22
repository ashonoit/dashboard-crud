/**
 * backend/controllers/payments.controller.js
 */
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const Payment = require("../models/Payment.js");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");

// init Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount } = req.body;
    const amountInPaise = amount * 100;
    const options = { amount: amountInPaise, currency: "INR" };
    const order = await razorpay.orders.create(options);

    // Save to DB
    const payment = new Payment({
      user: req.user.id,
      amount: amountInPaise,
      orderId: order.id,
      status: "created",
      method: "razorpay",
    });
    await payment.save();

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay error:", err.message);
    res.status(500).json({ error: "Server error creating order: " + err.message });
  }
};

// ✅ Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (payment) {
      payment.status = "paid";
      payment.paymentId = razorpay_payment_id;
      await payment.save();
    } else {
      return res.status(404).json({ ok: false, error: "Payment not found" });
    }

    res.json({ ok: true, orderId: razorpay_order_id });

    // Send confirmation email (non-blocking)
    (async () => {
      try {
        const user = await User.findById(req.user.id);
        if (user?.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Payment Successful",
            text: `Your payment of ₹${payment.amount / 100} was successful. Order ID: ${razorpay_order_id}`,
          });
        }
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr.message);
        // Don't fail the payment verification due to email issues
      }
    })();
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error verifying payment" });
  }
};

// ✅ Refund Payment
const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = await Payment.findOne({ orderId });
    if (!payment || payment.status !== "paid") {
      return res.status(400).json({ error: "Invalid payment or not paid" });
    }

    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: payment.amount,
    });

    payment.status = "refunded";
    await payment.save();

    res.json({ ok: true, refund });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error refunding payment" });
  }
};

// ✅ Get Payment History
const getHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(payments.map(payment => ({
      ...payment._doc,
      amount: payment.amount / 100,
      method: payment.method || 'Unknown'
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching history" });
  }
};

// ✅ Webhook
const webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.rawBody);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body.event;
    if (event === "payment.captured") {
      const payment = await Payment.findOne({ orderId: req.body.payload.payment.entity.order_id });
      if (payment) {
        payment.status = "paid";
        payment.paymentId = req.body.payload.payment.entity.id;
        await payment.save();
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  refundPayment,
  getHistory,
  webhook,
};
