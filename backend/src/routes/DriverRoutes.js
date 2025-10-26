import express from "express";
import { getAllDrivers } from "../controllers/DriverController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Read-only route for admin
router.get("/", authMiddleware, getAllDrivers);

export default router;
