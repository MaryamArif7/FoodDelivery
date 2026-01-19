import {
  SignUpUser,
  SignIn,
  SignUpDriver,
  SignUpResturant,
} from "../controllers/authController.js";
import express from "express";
import { createUploadMiddleware } from "../middlewares/upload.js";

const router = express.Router();
router.use((req, res, next) => {
  next();
});

let upload;
try {
  upload = createUploadMiddleware();
  console.log("Upload middleware created successfully");
} catch (error) {
  console.error("Failed to create upload middleware:", error.message);

  upload = {
    fields: () => (req, res, next) => {
      console.error(" Upload middleware failed to initialize");
      next(new Error("Upload middleware not available"));
    },
  };
}

router.post(
  "/signin",
  (req, res, next) => {
    console.log(" Signin route handler called");
    next();
  },
  SignIn,
);

router.post(
  "/signup/user",
  (req, res, next) => {
    console.log(" User signup route handler called");
    next();
  },
  SignUpUser,
);

router.post(
  "/signup/resturant",
  (req, res, next) => {
    next();
  },
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
  },
  SignUpResturant,
);

router.post(
  "/signup/driver",
  (req, res, next) => {
    next();
  },
  upload.none(),
  (req, res, next) => {
    console.log("   Body after parsing:", req.body);
    next();
  },
  SignUpDriver,
);

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

export default router;
