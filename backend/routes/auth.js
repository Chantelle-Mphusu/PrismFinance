import express from "express";
import {
  Login,
  Signup,
  getMe,
  logout,
  verifyEmail,
  verify2FA,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/verify-email", verifyEmail);
router.post("/verify-2fa", verify2FA);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

export default router;