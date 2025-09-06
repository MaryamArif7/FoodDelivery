import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema(
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
      default: "restaurant",
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
    //available or not
    status:{
        type:String,
        enum:['open','close'],
    },
    openingHours:{
        type:String,
        required:true
    },
    orderCompleted:{
        type:String,
        required:true,
    },
   logo:{
    type:String,
    required:true,
   },
   coverImage:{
    type:String,
    required:true,
   }
  
  
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
