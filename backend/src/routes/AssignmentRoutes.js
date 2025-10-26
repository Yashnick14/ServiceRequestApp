import express from "express";
import { body, param } from "express-validator";
import { createOrUpdateAssignment } from "../controllers/AssignmentController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidateMiddleware.js";

const router = express.Router();

// Validation Rules
const assignmentValidation = [
  param("request_id")
    .isInt({ min: 1 })
    .withMessage("Request ID must be a valid number"),

  body("driver_id")
    .isInt({ min: 1 })
    .withMessage("Driver ID is required and must be a number"),

  body("vehicle_id")
    .isInt({ min: 1 })
    .withMessage("Vehicle ID is required and must be a number"),

  body("scheduled_time")
    .notEmpty()
    .withMessage("Scheduled time is required")
    .isISO8601()
    .withMessage("Scheduled time must be a valid date"),
];

// Coordinator schedules a request
router.post(
  "/:request_id/schedule",
  authMiddleware,
  assignmentValidation,
  validateRequest,
  createOrUpdateAssignment
);

export default router;
