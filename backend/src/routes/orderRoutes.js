import express from "express";
import {
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
   createOrder,
  updatePaymentStatus,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder
} from "../controllers/orderController.js";
// import { verifyDriver } from "../middleware/auth.js";

const router = express.Router();

// Fetch available orders (prepared & unassigned)
router.get("/orders", getAvailableOrders);

// Accept an order
router.put("/orders/:orderId/accept", acceptOrder);

// Update delivery status (on_the_way → delivered)
router.put("/orders/:orderId/status", updateDeliveryStatus);
// Create order
router.post('/create', createOrder);

// Update payment status
router.post('/update-payment-status', updatePaymentStatus);

// Get order by ID
router.get('/:orderId', getOrderById);

// Get user's orders
router.get('/user/:userId', getUserOrders);

// Update order status (for restaurant/admin)
router.patch('/:orderId/status', updateOrderStatus);

// Cancel order
router.patch('/:orderId/cancel', cancelOrder);

export default router;
