import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "name email phone")
      .populate("items.menuId")
      .populate("items.restaurantId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentStatus,
      orderStatus,
    } = req.body;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !deliveryAddress ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);

    const order = new Order({
      userId,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentStatus: paymentStatus || "pending",
      orderStatus: orderStatus || "pending",
      estimatedDeliveryTime,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentIntentId, paymentStatus, orderStatus } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (paymentIntentId) order.paymentIntentId = paymentIntentId;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();

    if (paymentStatus === "paid") {
      await Cart.findOneAndUpdate(
        { userId: order.userId },
        { $set: { items: [] } }
      );
    }
  //  console.log(order);
   // console.log(order.items.restaurantId._id.toString())
    const io = req.app.get("io");
    io.to(`restaurant:${order.items[0].restaurantId.toString()}`).emit("order:new", {
      success: true,
      order: {
        orderId: order._id,
        fullName: order.deliveryAddress.fullName,
        items: order.items,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        orderStatus: "confirmed",
        createdAt: order.createdAt,
      },
    });
    const userId = order.userId._id.toString();
   // const userId = order.userId.toString();
    io.to(`user:${userId}`).emit("order:created", {
      success: true,
      order: {
        orderId: order._id,
        orderStatus: "confirmed",
        message:
          "Order placed successfully! Waiting for restaurant confirmation.",
      },
    });
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};
//this function is being used by resturant to update the staus of the order for the user
//it emit the real time order staus for the user 
export const status = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, restaurantId } = req.body;
    console.log("order staus from frontend for  updated here", orderStatus);
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus, updatedAt: new Date() },
      { new: true }
    ).populate("userId");
    console.log("order after update", order);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const io = req.app.get("io");
    const emitData = {
      success: true,
      order: {
        _id: order._id,
        orderStatus: order.orderStatus,
        items: order.items,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
      },
      orderId: order._id,
      orderStatus: order.orderStatus,
    
    };
    const userId = order.userId._id.toString();
    const roomName = `user:${userId}`;

    console.log(" EMITTING EVENT: order:status-updated");
    console.log(" TO ROOM:", roomName);
    console.log("DATA:", JSON.stringify(emitData, null, 2));
    io.to(roomName).emit("order:status-updated", emitData);

    const io_instance = req.app.get("io");
    const roomSockets = io_instance.sockets.adapter.rooms.get(roomName);
    console.log(" Event emitted to room:", roomName);
    console.log(" Clients in room:", roomSockets ? roomSockets.size : 0);
    if (roomSockets) {
      console.log(" Socket IDs:", Array.from(roomSockets));
    }
    if (orderStatus === "ready") {
      io.to("available-drivers").emit("order:ready-for-pickup", {
        orderId: order._id,
        restaurantName: order.restaurantId.name,
        deliveryAddress: order.deliveryAddress,
        earnings: calculateDriverEarnings(order.totalAmount),
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { orderStatus } = req.query;
    console.log(
      "Fetching orders for restaurant:",
      restaurantId,
      "with status:",
      orderStatus
    );

    if (!restaurantId) {
      return res.status(400).json({
        message: "Restaurant ID is required",
        success: false,
      });
    }

    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    const query = {
      "items.restaurantId": restaurantObjectId,
    };

    if (orderStatus) {
      const statusArray = orderStatus.split(",").map((s) => s.trim());
      query.orderStatus = { $in: statusArray };
    }

    console.log("Query:", JSON.stringify(query, null, 2));

    const orders = await Order.find(query)
      .populate("userId", "name phone email")
      .populate("items.menuId", "name price imageUrl")
      .populate("items.restaurantId", "name email phone logo")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    console.log("Orders found:", orders.length);

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error in getRestaurantOrders:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
