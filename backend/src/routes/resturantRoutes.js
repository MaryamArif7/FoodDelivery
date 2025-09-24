import mongoose from "mongoose";
import express from "express";
import { createUploadMiddleware } from "../middlewares/upload.js";
import {
  getAllResturants,
  addMenu,
} from "../controllers/resturantControllers.js";
const router = express.Router();
let upload = createUploadMiddleware();
router.get("/resturants", getAllResturants);
router.use("/resturants/:id/addMenu", upload.array("images", 5), addMenu);
export default router;
