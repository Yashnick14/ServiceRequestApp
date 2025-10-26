import express from "express";
import { getAllVehicles } from "../controllers/VehicleController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Read-only route for admin
router.get("/", authMiddleware, getAllVehicles);

export default router;
