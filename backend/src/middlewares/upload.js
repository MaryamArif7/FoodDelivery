// controllers/restaurantController.js
import multer from "multer";
import Item from "../models/item.js";
import Restaurant from "../models/restaurant.js";

// Setup multer storage (images in /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

// Controller
export const addMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant does not exist" });
    }

    // req.body.items is JSON string → parse
    const items = JSON.parse(req.body.items);

    // Attach images to corresponding items
    const files = req.files; // array of images
    items.forEach((item, i) => {
      if (files[i]) {
        item.imageUrl = `/uploads/${files[i].filename}`;
      }
    });

    // Insert items into Item collection
    const newItems = await Item.insertMany(items);

    // Push references to restaurant.menu
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
