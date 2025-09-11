import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    // address: [
    //   {
    //     street: {
    //       type: String,
    //       required: true,
    //     },
    //     city: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
    address:{
      type:String,
      required:true,
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
     lastLogin: Date,
  },
 
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
