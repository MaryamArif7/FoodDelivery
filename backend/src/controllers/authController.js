import User from "../models/User.js";
import Restaurant from "../models/Resturants.js";
import Driver from "../models/Driver.js";
import Admin from "../models/Admin.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const SignUpUser = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;
  try {
    if (!name) {
      return res.status(404).json("Please provide name");
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password is required" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);

    if (role === "user") {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
      });
      await newUser.save();
      return res.status(200).json("Resturant Created Successfully!");
    }
  } catch (e) {
    res.status(401).json("Please Provide a valid role");
  }
};
export const SignUpResturant = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    description,
    approved,
    openingHours,
    logo,
    coverImage,
    orderCompleted,
  } = req.body;
  try {
    if (!name) {
      return res.status(404).json("Please provide name");
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password is required" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);

    if (role === "resturant") {
      const newResturant = new Restaurant({
        name,
        email,
        password: hashedPassword,
        role,
        approved: "pending",
        phone,
        address,
        description,
        openingHours,
        logo,
        coverImage,
        orderCompleted,
      });
      await newResturant.save();
      return res.status(200).json("Resturant Created Successfully!");
    }
  } catch (e) {
    res.status(401).json("Please Provide a valid role");
  }
};
export const SignUpDriver = async (req, res) => {
  const { name, email, password, role, phone, address, vehicleType } = req.body;
  try {
    if (!name) {
      return res.status(404).json("Please provide name");
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password is required" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    if (role === "driver") {
      const newDriver = new Driver({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        vehicleType,
      });
      await newDriver.save();
      return res.status(200).json("Driver Created Successfully!");
    }
  } catch (e) {
    res.status(401).json("Please Provide a valid role");
  }
};

class AuthService {
  static async findUserByEmail(email) {
    const [admin, user, restaurant, driver] = await Promise.all([
      Admin.findOne({ email }),
      User.findOne({ email }),
      Restaurant.findOne({ email }),
      Driver.findOne({ email }),
    ]);
    if (admin) return { user: admin, role: "admin", model: "Admin" };
    if (user) return { user, role: "user", model: "User" };
    if (restaurant)
      return { user: restaurant, role: "restaurant", model: "Restaurant" };
    if (driver) return { user: driver, role: "driver", model: "Driver" };
    return null;
  }
  static async signIn(email, password) {
    try {
      const validUser = await this.findUserByEmail(email);
      if (!validUser) {
        throw new Error("Invalid credentials");
      }
      const { user, role, model } = validUser;
      const isValidPassword = await bycrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }
      if (role === "restaurant" && user.approved !== "accepted") {
        throw new Error("Account not approved yet");
      }
      await mongoose.model(model).findByIdAndUpdate(user._id, {
        lastLogin: new Date(),
      });
      const tokenPayload = {
        id: user._id,
        email: user.email,
        role: role,
        name: user.name,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: role,
        },
      };
    } catch (e) {
      throw error;
    }
  }
}
export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }
    const result = await AuthService.signIn(email, password);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      ...result,
    });
  } catch (e) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ success: false, message: error.message });
    }

    if (
      error.message.includes("not approved") 
    ) {
      return res.status(403).json({ success: false, message: error.message });
    }
  }
};
