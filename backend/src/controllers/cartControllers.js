import Item from "../models/Item.js"
import Cart from "../models/Cart.js"
import mongoose from "mongoose";
export const addToCart = async (req, res) => {
  try {
    const { id, menuId, quantity, restaurantId } = req.body;
    if (!id || !menuId || !quantity) {
      res.status(400).json({
        message: "All fields are Required",
        success: false,
      });
    }
    const menuItem = await Item.findById(menuId);
    if (!menuItem) {
      res.status(400).json({
        message: "Menu Item Not Found",
        success: false,
      });
    }
    if (menuItem.restaurantId.toString() !== restaurantId) {
      return res.status(400).json({
        message: "Menu item does not belong to this restaurant",
        success: false,
      });
    }
    let cart=await Cart.findOne({userId:id});
    if(cart){
        const itemIndex=cart.items.findIndex(item=>itmes.menuId.toString===menuId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
    
        cart.items.push({ restaurantId, menuId, quantity });
      }

    }
    else {
   
      cart = new Cart({
        userId: id,
        items: [{ restaurantId, menuId, quantity }]
      });
        await cart.save();

   
    await cart.populate('items.menuId items.restaurantId');

    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
      cart
    });
  }} catch (e) {
    console.error("Error in addToCart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
export const updateCartItemQuantity=()=>{

}
export const deleteCartItems=()=>{

}
export const fetchCartItems=()=>{
    
}