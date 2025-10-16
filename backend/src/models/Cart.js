import mongoose from 'mongoose';
const  cartSchema=new mongoose.Schema({
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
    
   items: [{
    menuId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true,
    },
    restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
      quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
       
        },
   }],
} ,{timestamps:true});
export default mongoose.model("Cart",cartSchema);