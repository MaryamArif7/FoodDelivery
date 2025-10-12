import moongoose from 'mongoose';
const  cartSchema=new moongoose.Schema({
   userId:{
    type:moongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   items: [{
    menuId:{
        type:moongoose.Schema.Typesype.ObjectId,
        ref:'Item',
        required:true,
    },
      quantity: {
          type: Number,
          required: true,
          min: 1,
        },
   }],
} ,{timestamps:true});
export default moongoose.model("Cart",cartSchema);