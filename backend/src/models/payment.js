import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["card", "cash"], required: true },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
  transactionId: { type: String }, 
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
