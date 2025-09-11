import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "../src/routes/authRoutes.js"
import cors from 'cors';
dotenv.config();

mongoose.connect('mongodb+srv://maryam7:maryam1306@maryam.xoazkgz.mongodb.net/?retryWrites=true&w=majority&appName=maryam',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  const app=express();
app.use(express.json());
app.use(cors());
app.use("/api",authRoutes);




app.listen(5000,()=>{
    console.log("foodRush is running on PORT 5000")
})