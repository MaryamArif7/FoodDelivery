import express from 'express';
const router = express.Router();
const {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
  getUserPayments,
  createRefund,
} = require('../controllers/paymentController');
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/create-payment-intent', createPaymentIntent);
router.get('/status/:paymentId', getPaymentStatus);
router.get('/user/:userId', getUserPayments);
router.post('/refund/:paymentId', createRefund);

export default router;