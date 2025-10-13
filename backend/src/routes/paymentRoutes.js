const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
  getUserPayments,
  createRefund,
} = require('../controllers/paymentController');

// Note: If you have auth middleware, import it
// const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes (add auth middleware as needed)
router.post('/create-payment-intent', createPaymentIntent);
router.get('/status/:paymentId', getPaymentStatus);
router.get('/user/:userId', getUserPayments);

// Admin only route (add admin authorization middleware)
router.post('/refund/:paymentId', createRefund);

module.exports = router;