const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const auth = require('../middleware/auth');

// create order
router.post('/create-order', auth, [ body('amount').isFloat({ gt: 0 }) ], paymentsController.createOrder);

// verify payment
router.post('/verify', auth, paymentsController.verifyPayment);

// refund
router.post('/refund', auth, paymentsController.refundPayment);

// history
router.get('/history', auth, paymentsController.getHistory);

// webhook
router.post(
  '/webhook',
  express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }),
  paymentsController.webhook
);

module.exports = router;
