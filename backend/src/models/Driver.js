import mongoose from "mongoose";
const driverSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
   name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "restaurant", "driver", "admin"],
      default: "driver",
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
      },
    ],
  vehicleType: { type: String, required: true },
  status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  currentLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
   lastLogin: Date,
}, { timestamps: true });

driverSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("Driver", driverSchema);
