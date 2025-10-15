import Order from "../models/order.model.js";

// Fetch all available orders (prepared and not yet assigned)
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryStatus: "prepared",
      driverId: null,
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching available orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
// GET /api/orders/:orderId
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Accept an order (driver takes it)
export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const driverId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.driverId)
      return res.status(400).json({ message: "Order already assigned" });

    order.driverId = driverId;
    order.deliveryStatus = "on_the_way";
    await order.save();

    const io = req.app.get("io");
    io.emit("order:driver-assigned", order);

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ success: false, message: "Failed to accept order" });
  }
};

// Update delivery status (e.g. on_the_way → delivered)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryStatus = status;
    await order.save();

    const io = req.app.get("io");
    io.emit("order:status-updated", {
      orderId: order._id,
      status: order.deliveryStatus,
      restaurantId: order.restaurantId,
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};
