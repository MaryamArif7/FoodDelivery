// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    restaurantId: { type: String, default: "default_restaurant" },
    shippingDetails: {
      name: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    status: { type: String, enum: ["pending", "accepted", "prepared", "on_the_way", "delivered"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
