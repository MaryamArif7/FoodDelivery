const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      enum: ["user", "restaurant", "driver", "admin"],
      default: "restaurant",
    },
    status: { type: String, enum: ["open", "close"], default: "open" },
    approved:{type:String,enum:["pending","accepted"]},
    openingHours: { type: String, required: true },
    logo: String,
    coverImage: String,
    orderCompleted: { type: Number, default: 0 },
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
