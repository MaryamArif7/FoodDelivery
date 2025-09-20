import mongoose from "mongoose";
import express from "express";
import {getPendingResturants,updateResturantApproval} from "../controllers/resturantControllers.js";
const router=express.Router();
router.get('/resturants/pending',getPendingResturants);
router.patch('/resturants/:id/approval',updateResturantApproval);
export default router;