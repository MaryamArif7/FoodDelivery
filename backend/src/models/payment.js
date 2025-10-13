import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'usd',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    productDetails: {
      name: String,
      description: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
    customerEmail: String,
    refundId: String,
    refundAmount: Number,
    metadata: {
      type: Map,
      of: String,
    },
    errorMessage: String,
  },
  {
    timestamps: true, 
  }
);
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.virtual('formattedAmount').get(function () {
  return `${this.currency.toUpperCase()} ${(this.amount / 100).toFixed(2)}`;
});
export default mongoose.model("Payment", paymentSchema);
