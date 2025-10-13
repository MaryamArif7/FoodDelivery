import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });
const cloudinaryVars = Object.keys(process.env).filter(key => key.includes('CLOUDINARY'));

import authRoutes from "./routes/authRoutes.js"
import resturantRoutes from "./routes/resturantRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes  from './routes/paymentRoutes';
import cors from 'cors';
mongoose.connect('mongodb+srv://maryam7:maryam1306@maryam.xoazkgz.mongodb.net/?retryWrites=true&w=majority&appName=maryam',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

const app = express();
app.use('/api/payment/webhook', require('./routes/paymentRoutes'));

app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", resturantRoutes);
app.use("/api", adminRoutes);
app.use("/api/cart",cartRoutes);
app.use('/api/payment', paymentRoutes);
app.listen(5000, () => {
    console.log(' foodRush is running on PORT 5000');
})