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
  console.log(`\n📍 Auth Route Hit:`);
  console.log(`   Path: ${req.path}`);
  console.log(`   Method: ${req.method}`);
  console.log(`   Base URL: ${req.baseUrl}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  next();
});


console.log('🔧 Creating upload middleware...');
let upload;
try {
  upload = createUploadMiddleware();
  console.log('✅ Upload middleware created successfully');
} catch (error) {
  console.error('❌ Failed to create upload middleware:', error.message);
  // Create a dummy middleware that will log the error
  upload = {
    fields: () => (req, res, next) => {
      console.error('❌ Upload middleware failed to initialize');
      next(new Error('Upload middleware not available'));
    }
  };
}

console.log('🛣️  Setting up individual routes...');

router.post("/signin", (req, res, next) => {
  console.log('✅ Signin route handler called');
  next();
}, SignIn);

router.post("/signup/user", (req, res, next) => {
  console.log('✅ User signup route handler called');
  next();
}, SignUpUser);

// Add extensive debugging to the restaurant signup route
router.post(
  "/signup/resturant",
  (req, res, next) => {
    console.log('\n🏪 RESTAURANT SIGNUP ROUTE HIT!');
    console.log('   ✅ First middleware reached');
    console.log('   Content-Type:', req.get('content-type'));
    console.log('   Body keys:', Object.keys(req.body || {}));
    console.log('   Files before upload:', req.files ? 'Files present' : 'No files yet');
    next();
  },
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log('   ✅ Upload middleware completed successfully');
    console.log('   Files after upload:', req.files);
    console.log('   Body after upload:', Object.keys(req.body || {}));
    next();
  },
  (req, res, next) => {
    console.log('   ✅ About to call SignUpResturant controller');
    next();
  },
  SignUpResturant
);

router.post(
  "/signup/driver",
  (req, res, next) => {
    console.log('✅ Driver signup route handler called');
    console.log('   Content-Type:', req.get('content-type'));
    next();
  },
  upload.none(), // ✅ Add this to parse multipart/form-data without files
  (req, res, next) => {
    console.log('   Body after parsing:', req.body);
    next();
  },
  SignUpDriver
)

// Add a test route within auth routes
router.get("/test", (req, res) => {
  console.log('✅ Auth test route hit');
  res.json({ message: 'Auth routes working!' });
});

console.log('✅ Auth routes setup complete');

export default router;