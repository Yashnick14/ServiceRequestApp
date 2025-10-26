import express from "express";
import { body, query, param } from "express-validator";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/RequestController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { validateRequest } from "../middleware/ValidateMiddleware.js";

const router = express.Router();

/* ------------------- VALIDATION RULES ------------------- */

// Create Request (Customer)
const createRequestValidation = [
  body("customer_name")
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("pickup_location").notEmpty().withMessage("Pickup location is required"),

  body("dropoff_location")
    .notEmpty()
    .withMessage("Dropoff location is required"),

  body("pickup_time")
    .notEmpty()
    .withMessage("Pickup time is required")
    .isISO8601()
    .withMessage("Pickup time must be a valid date"),

  body("passengers")
    .isInt({ min: 1 })
    .withMessage("Passengers must be a number greater than 0"),

  body("notes").optional().isString().withMessage("Notes must be a string"),
];

// Update Status (Coordinator)
const updateStatusValidation = [
  param("id").isInt().withMessage("Request ID must be valid"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected", "scheduled"])
    .withMessage("Invalid status value"),
];

// Get Requests (Coordinator) with optional search
const getRequestsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a number"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a number"),
  query("search").optional().isString(),
];

// Delete Request
const deleteRequestValidation = [
  param("id").isInt().withMessage("Request ID must be valid"),
];

/* ------------------- ROUTES ------------------- */

// Customer creates request
router.post("/", createRequestValidation, validateRequest, createRequest);

// Coordinator views paginated requests (protected)
router.get(
  "/",
  authMiddleware,
  getRequestsValidation,
  validateRequest,
  getRequests
);

// Coordinator updates request status
router.put(
  "/:id",
  authMiddleware,
  updateStatusValidation,
  validateRequest,
  updateRequestStatus
);

// Coordinator deletes a request
router.delete(
  "/:id",
  authMiddleware,
  deleteRequestValidation,
  validateRequest,
  deleteRequest
);

export default router;
