import Resturant from "../models/Resturants.js";
import Item from "../models/Item.js";
import Order from "../models/Order.js";
export const getAllResturants = async (req, res) => {
  try {
    const getAllResturants = await Resturant.find({ approved: "active" }).populate('menu');
    res.status(200).json({ message: "success", data: getAllResturants });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

export const addMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Resturant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant does not exist" });
    }

    const items = JSON.parse(req.body.items);
    console.log("Recived Items", items);
    const files = req.files;
    console.log("Recived Files", files);
    items.forEach((item, i) => {
      if (files[i]) {
        item.imageUrl = files[i].path;
      }
      console.log("item after mapping the path", item);
      item.restaurantId = restaurant._id;
    });
    const newItems = await Item.insertMany(items);
    const addedItems = newItems.map((item) => item._id);
    restaurant.menu.push(...addedItems);
    await restaurant.save();
    const updatedRestaurant = await restaurant.populate("menu");

    res.status(200).json({
      message: "Items added successfully",
      data: updatedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};


export const resturantStats = async (req, res) => {
  try {
    const { id } = req.params;
  const orderCount = await Order.countDocuments({ 
      "items.restaurantId": id 
    });
   // console.log(orderCount);
    return res.status(200).json({
      message: "Success",
      data: {
        Orders: orderCount,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to fetch stats",
      error: e.message,
    });
  }
};
export const EditMenu = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req);
    console.log(req.body);
    const { price } = req.body;
    const updatedMenu = await Item.findByIdAndUpdate(
      id,
      {
        price: price,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Success",
      data: {
        menu: updatedMenu,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to update the Menu Price",
      error: e.message,
    });
  }
};
export const DeleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenu = await Item.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }
    return res.status(200).json({
      message: "Menu item deleted successfully",
      data: {
        menu: deletedMenu,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to update the Menu Price",
      error: e.message,
    });
  }
};