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
    const resturant = await Resturant.findById(id);
    if (!resturant) {
      return res.status(404).json({
        message: "Resturant does not exist",
      });
    }
    const newItems = await Item.insertMany(items);
    const addedItems = newItems.map((item) => item._id);
    resturant.menu.push(...addedItems);
    await resturant.save();
    const updatedRestaurant = await resturant.populate("menu");

    res
      .status(200)
      .json({ message: "Items added successfully", data: updatedRestaurant });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};
