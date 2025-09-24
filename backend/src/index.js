import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Loading environment variables...');
console.log('Current directory:', __dirname);
console.log('Looking for .env at:', path.join(__dirname, '.env'));

// Try multiple ways to load .env
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  // Try default location
  console.log('Trying default .env loading...');
  dotenv.config();
} else {
  console.log('✅ .env file loaded successfully');
}

// Debug environment variables
console.log('=== ENV VARIABLES DEBUG ===');
const cloudinaryVars = Object.keys(process.env).filter(key => key.includes('CLOUDINARY'));
console.log('Found Cloudinary vars:', cloudinaryVars);
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

// Rest of your server code...
import authRoutes from "./routes/authRoutes.js"
import resturantRoutes from "./routes/resturantRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from 'cors';

mongoose.connect('mongodb+srv://maryam7:maryam1306@maryam.xoazkgz.mongodb.net/?retryWrites=true&w=majority&appName=maryam',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", resturantRoutes);
app.use("/api", adminRoutes);

app.listen(5000, () => {
    console.log('🚀 foodRush is running on PORT 5000');
})