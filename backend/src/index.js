import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "../src/routes/authRoutes.js"
dotenv.config();

mongoose.connect('mongodb+srv://mary:mary7@foodrush.zk9bxux.mongodb.net/?retryWrites=true&w=majority&appName=FoodRush',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  const app=express();
app.use(express.json());
app.use("/",authRoutes);




app.listen(5000,()=>{
    console.log("foodRush is running on PORT 5000")
})