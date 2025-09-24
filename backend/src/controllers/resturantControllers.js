import Resturant from "../models/Resturants.js";
import Item from "../models/Item.js";
export const getAllResturants = async (req, res) => {
  try {
    const getAllResturants = await Resturant.find({ approved: "active" });
    res.status(200).json({ message: "success", data: getAllResturants });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

export const addMenu = async (req, res) => {
  try {
    const { items } = req.body;
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant does not exist",
      });
    }

    const files = req.files;
    items.forEach((item, i) => {
      if (files[i]) {
        item.imageUrl = files[i].path;
      }
    });

    const newItems = await Item.insertMany(items);

    const addedItems = newItems.map((item) => item._id);
    restaurant.menu.push(...addedItems); // Fixed typo
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
