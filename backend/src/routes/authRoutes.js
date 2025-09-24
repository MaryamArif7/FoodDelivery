import {
  SignUpUser,
  SignIn,
  SignUpDriver,
  SignUpResturant,
} from "../controllers/authController.js";
import express from "express";
import { createUploadMiddleware } from "../middlewares/upload.js";
const upload = createUploadMiddleware();
const router = express.Router();
router.post("/signin", SignIn);
router.post("/signup/user", SignUpUser);
router.post(
  "/signup/resturant",
  upload.fields([
    { name: "logo", maxCount: 1 },
  ]),
  SignUpResturant
);
router.post("/signup/driver", SignUpDriver);
export default router;
