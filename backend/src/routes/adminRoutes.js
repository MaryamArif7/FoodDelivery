import mongoose from "mongoose";
import express from "express";
import {getPendingResturants,updateResturantApproval} from "../controllers/adminControllers.js";
const router=express.Router();
router.get('/resturants/pending',getPendingResturants);
router.patch('/resturants/:id/approve',updateResturantApproval);
export default router;