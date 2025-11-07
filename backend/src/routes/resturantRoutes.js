import mongoose from "mongoose";
import express from "express";
import { createUploadMiddleware } from "../middlewares/upload.js";
import {
  getAllResturants,
  addMenu,
  resturantStats,
  EditMenu,
  DeleteMenu
} from "../controllers/resturantControllers.js";
const router = express.Router();
let upload = createUploadMiddleware();
router.get("/resturants", getAllResturants);
router.use("/resturants/:id/addMenu", upload.array("images", 5), addMenu);
router.get("/resturant/stats/:id",resturantStats);
router.put("/resturant/edit/:id", EditMenu);
router.delete("/resturant/delete/:id",DeleteMenu);
export default router;
