import express from "express";
import {
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
} from "../controllers/driver.controller.js";
import { verifyDriver } from "../middleware/auth.js";

const router = express.Router();

// Fetch available orders (prepared & unassigned)
router.get("/orders", verifyDriver, getAvailableOrders);

// Accept an order
router.put("/orders/:orderId/accept", verifyDriver, acceptOrder);

// Update delivery status (on_the_way → delivered)
router.put("/orders/:orderId/status", verifyDriver, updateDeliveryStatus);

export default router;
