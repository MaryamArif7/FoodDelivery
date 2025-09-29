import Resturant from "../models/Resturants.js";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
export const getPendingResturants = async (req, res) => {
  try {
    const allPendingResturants = await Resturant.find({ approved: "pending" });
    res.status(200).json({ message: "success", data: allPendingResturants });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};
export const updateResturantApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Resturant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.approved === "active") {
      return res.status(400).json({
        message: "Restaurant is already active",
      });
    }

    restaurant.approved = "active";
    await restaurant.save();

    return res.status(200).json({
      message: "success",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};
export const adminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const resturants = await Resturant.countDocuments();
    const drivers = await Driver.countDocuments();
    return res.status(200).json({
      message: "Success",
      data: {
        Users: users,
        Resturants: resturants,
        Drivers: drivers,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to fetch stats",
      error: e.message,
    });
  }
};
export const allUsers=async(req,res)=>{
try {
    const getAllUsers = await User.find();
    res.status(200).json({ message: "success", data:  getAllUsers});
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
}
export const allDrivers=async(req,res)=>{
try {
    const getAllDrivers = await Driver.find();
    res.status(200).json({ message: "success", data:  getAllDrivers});
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
}