import express from 'express';
import { addToCart,updateCartItemQuantity,deleteCartItems,fetchCartItems } from '../controllers/cartControllers.js';
const router=express.Router();
router.post('/add',addToCart);
router.put('/update',updateCartItemQuantity);
router.delete('/delete/:id/:menuId', deleteCartItems);
router.get('/get/:id',fetchCartItems);
export default router;
