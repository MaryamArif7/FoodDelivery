import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('items.menuId')
      .populate('items.restaurantId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      
    });
  }
};
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
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.json({ success: true, data: order });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch order" });
//   }
// };

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
      orderStatus
    } = req.body;

    // Validate required fields
    if (!userId || !items || items.length === 0 || !deliveryAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate estimated delivery time (e.g., 45 minutes from now)
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);

    // Create order
    const order = new Order({
      userId,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentStatus: paymentStatus || 'pending',
      orderStatus: orderStatus || 'pending',
      estimatedDeliveryTime
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
     
    });
  }
};

// Update order payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentIntentId, paymentStatus, orderStatus } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    if (paymentIntentId) order.paymentIntentId = paymentIntentId;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();

    // If payment is successful, clear the user's cart
    if (paymentStatus === 'paid') {
      await Cart.findOneAndUpdate(
        { userId: order.userId },
        { $set: { items: [] } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get order by ID


// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 10, page = 1 } = req.query;

    const query = { userId };
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('items.menuId', 'name image')
      .populate('items.restaurantId', 'name');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order status (for restaurant/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;

    // Set actual delivery time if delivered
    if (orderStatus === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = cancelReason || 'Cancelled by user';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
