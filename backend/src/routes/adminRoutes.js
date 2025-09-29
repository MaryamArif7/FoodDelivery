import mongoose from "mongoose";
import express from "express";
import {getPendingResturants,updateResturantApproval,adminStats} from "../controllers/adminControllers.js";
const router=express.Router();
router.get('/resturants/pending',getPendingResturants);
router.patch('/resturants/:id/approve',updateResturantApproval);
router.get('/admin/stats',adminStats);
export default router;