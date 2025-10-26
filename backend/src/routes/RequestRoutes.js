import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/RequestController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Customer creates request
router.post("/", createRequest);

// Admin routes (protected)
router.get("/", authMiddleware, getRequests);
router.put("/:id", authMiddleware, updateRequestStatus);
router.delete("/:id", authMiddleware, deleteRequest);

export default router;
