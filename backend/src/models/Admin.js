import mongoose from "mongoose";
const adminSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:['user','admin','resturant','driver'],
    default:'admin'
  }
})
export default mongoose.model("Admin", adminSchema);