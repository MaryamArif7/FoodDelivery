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
import paymentRoutes  from "./routes/paymentRoutes.js";
import cors from 'cors';
import { Server } from "socket.io";
import { setupOrderRoutes } from "./routes/orderRoutes.js";
import http from "http";
mongoose.connect('mongodb+srv://maryam7:maryam1306@maryam.xoazkgz.mongodb.net/?retryWrites=true&w=majority&appName=maryam',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
app.use("/api/payment/webhook", paymentRoutes);
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", resturantRoutes);
app.use("/api", adminRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", setupOrderRoutes(io));
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Optional: identify type (restaurant/driver)
  socket.on("identify", (role) => {
    console.log(`${role} connected: ${socket.id}`);
    socket.join(role);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});



server.listen(5000, () => console.log("Server running on port 5000"));