import express from "express";
import { createOrUpdateAssignment } from "../controllers/AssignmentController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Coordinator schedules a request
router.put("/:request_id", authMiddleware, createOrUpdateAssignment);

export default router;
