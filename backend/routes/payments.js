/**
 * backend/routes/payments.js
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const auth = require('../middleware/auth');

// create order (authenticated)
router.post('/create-order', auth, [ body('amount').isFloat({ gt: 0 }) ], paymentsController.createOrder);

// verify payment (authenticated)
router.post('/verify', auth, paymentsController.verifyPayment);

// refund (authenticated - admin or owner)
router.post('/refund', auth, paymentsController.refundPayment);

// history (authenticated)
router.get('/history', auth, paymentsController.getHistory);

// webhook - public endpoint; signature verified inside controller
router.post('/webhook', express.json({ verify: function(req,res,buf){ req.rawBody = buf; } }), paymentsController.webhook);

module.exports = router;
