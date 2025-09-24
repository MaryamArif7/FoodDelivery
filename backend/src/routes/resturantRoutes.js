import mongoose from "mongoose";
import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllResturants,
  addMenu,
} from "../controllers/resturantControllers.js";
const router = express.Router();
router.get("/resturants", getAllResturants);
router.post("/:id/addMenu", upload.array("images", 5), addMenu);
export default router;
