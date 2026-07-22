import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {getSettings,updateSettings,changePassword,} from "../controllers/settingsController.js";

const router = express.Router();

// GET SETTINGS
router.get("/", authMiddleware, getSettings);

// UPDATE SETTINGS
router.put("/", authMiddleware, updateSettings);

// CHANGE PASSWORD
router.put( "/change-password",authMiddleware,changePassword);

export default router;