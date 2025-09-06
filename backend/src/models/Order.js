import mongoose from "mongoose";
const orderSchema=new mongoose.Schema({
    status:{
        type:String,
        enum:['pending','accepted','preparing','onTheWay','delivered','cancelled']
    },
    menu:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Item"
        }

    ],
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
    bill:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    }
})
export default mongoose.model("Order",orderSchema);