import Item from "../models/Item.js"
import Cart from "../models/Cart.js"
import mongoose from "mongoose";
export const addToCart = async (req, res) => {
  try {
    const { id, restaurantId, menuId, quantity,price,image } = req.body;
    console.log(req.body);


    if (!id || !menuId || !quantity || !restaurantId || !price || !image) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    
   
    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
        success: false,
      });
    }
  
    const menuItem = await Item.findById(menuId);
    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
        success: false,
      });
    }
    

    if (menuItem.restaurantId.toString() !== restaurantId) {
      return res.status(400).json({
        message: "Menu item does not belong to this restaurant",
        success: false,
      });
    }
    
 
    let cart = await Cart.findOne({ userId: id });
    
    if (cart) {
   
      const itemIndex = cart.items.findIndex(
        item => item.menuId.toString() === menuId
      );
      
      if (itemIndex > -1) {
      
        cart.items[itemIndex].quantity += quantity;
      } else {
       
        cart.items.push({ restaurantId, menuId, quantity,price,image });
      }
    } else {
     
      cart = new Cart({
        userId: id,
        items: [{ restaurantId, menuId, quantity, price,image }]
      });
    }
    

    await cart.save();
  
    
    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
      cart
    });
    
  } catch (e) {
    console.error("Error in addToCart:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: e.message
    });
  }
};
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { id, menuId, quantity } = req.body;

   
    if (!id || !menuId || quantity === undefined) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

  
    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        success: false,
      });
    }

    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

  
    const itemIndex = cart.items.findIndex(
      item => item.menuId.toString() === menuId 
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
      });
    }

 
    cart.items[itemIndex].quantity = quantity;

 
    await cart.save();
    await cart.populate('items.menuId items.restaurantId');

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
      cart
    });

  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};
export const deleteCartItems = async (req, res) => {
  try {
    const { id, menuId,restaurantId } = req.body;
    if (!id || !menuId) {
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
    let cart = await Cart.findOne({ userId: id });

    cart.items = cart.items.filter((item) => item.menuId.toString() !== menuId);

    await cart.save();
    await cart.populate("items.menuId items.restaurantId");

    return res.status(200).json({
      message: "Item removed from cart",
      success: true,
      cart,
    });
  } catch (e) {
    console.error("Error in deleteCart:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const fetchCartItems = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }
 const cart = await Cart.findOne({ userId: id })
   .populate("items.menuId")
   .populate("items.restaurantId")
   .lean();

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
        items: [],
      });
    }

    return res.status(200).json({
      message: "Cart items fetched successfully",
      success: true,
      items: cart.items,
    });
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error:error.message
    });
  }
};