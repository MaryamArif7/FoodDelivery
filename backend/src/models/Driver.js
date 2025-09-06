import mongoose from "mongoose";
const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
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
  //Avaialable or not
  status: {
    type: String,
    required: true,
  },
     role: {
      type: String,
      enum: ["user", "restaurant", "driver", "admin"],
      default: "driver",
    },
  vehicleType: {
    type: String,
    required: true,
  },
  assignedOrders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
 currentLocation: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: [Number] 
}
},{timestamps:true});
export default mongoose.model("Driver", driverSchema);
