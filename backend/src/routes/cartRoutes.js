import express from 'express';
import { addToCart,updateCartItemQuantity,deleteCartItems,fetchCartItems } from '../controllers/cartControllers';
const router=express.Router();
router.post('/add',addToCart);
router.put('/update/:itmeId',updateCartItemQuantity);
router.delete('/delete/itemId',deleteCartItems);
router.get('/getCart',fetchCartItems);
export default router;
