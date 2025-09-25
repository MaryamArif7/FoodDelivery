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
    // parse JSON string back into array
    const items = JSON.parse(req.body.items);
    const files = req.files; // array of uploaded files
    const { id } = req.params;

    const restaurant = await Resturant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant does not exist" });
    }

    // merge files back into items
    items.forEach((item, i) => {
      if (files[i]) {
        item.imageUrl = files[i].path; // assign file path
      }
        item.restaurantId = restaurant._id; 
    });

    const newItems = await Item.insertMany(items);
    restaurant.menu.push(...newItems.map((item) => item._id));
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

