import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    quantity: { type: Number, required: true },
  }],
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "onTheWay", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryAddress: {
    street: String,
    city: String,
  },
  bill: { type: Number, required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
