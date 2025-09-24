import multer from "multer";
import Item from "../models/Item.js";
import Restaurant from "../models/Resturants.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "restaurant-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit", quality: "auto" },
    ],
  },
});

export const upload = multer({ storage });
