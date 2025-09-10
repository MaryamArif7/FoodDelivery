import {SignUp,SignIn,SignUpDriver,SignUpResturant} from '../controllers/authController.js';
import express from 'express';
const router=express.Router();
router.post('/signin',SignIn);
router.post('/signup',SignUp);
router.post('/signup/resturant',SignUpResturant);
router.post('/signup/driver',SignUpDriver);
export default router;