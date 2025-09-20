import mongoose from "mongoose";
import express from "express";
import {getAllResturants ,addMenu} from "../controllers/resturantControllers.js";
const router=express.Router();
router.get('/resturants',getAllResturants);
router.patch('/resturants/:id/addMenu',addMenu);
export default router;