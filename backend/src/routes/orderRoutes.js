import express from "express";
import {
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
} from "../controllers/orderController.js";
// import { verifyDriver } from "../middleware/auth.js";

const router = express.Router();

// Fetch available orders (prepared & unassigned)
router.get("/orders", getAvailableOrders);

// Accept an order
router.put("/orders/:orderId/accept", acceptOrder);

// Update delivery status (on_the_way → delivered)
router.put("/orders/:orderId/status", updateDeliveryStatus);

export default router;
