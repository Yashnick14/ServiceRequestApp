import express from "express";
import { body } from "express-validator";
import { login } from "../controllers/AuthController.js";
import { validateRequest } from "../middleware/ValidateMiddleware.js";

const router = express.Router();

// Validation rules
const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Login Route
router.post("/login", loginValidation, validateRequest, login);

export default router;
