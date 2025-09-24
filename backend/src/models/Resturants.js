import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      street: String,
      city: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "resturant", "driver", "admin"],
      default: "resturant",
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],

    status: { type: String, enum: ["open", "close"], default: "open" },
    approved: { type: String, enum: ["pending", "accepted"] },
    openingHours: { type: String, required: true },
    logo: String,
    coverImage: String,
    orderCompleted: { type: Number, default: 0 },
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
