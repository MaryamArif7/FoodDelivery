import express from "express";
import {

   createOrder,
  updatePaymentStatus,
  getOrderById,
  status,
  getRestaurantOrders
} from "../controllers/orderController.js";

const router = express.Router();
router.post('/create', createOrder);
router.post('/update-payment-status', updatePaymentStatus);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status',status);
router.get('/restaurant/:restaurantId', getRestaurantOrders);

export default router;
