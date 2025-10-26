import express from "express";
import { getDailyAnalytics } from "../controllers/AnalyticsController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/daily", authMiddleware, getDailyAnalytics);

export default router;
