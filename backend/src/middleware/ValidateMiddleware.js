import { validationResult } from "express-validator";

// Universal validation handler for all routes
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = {};
    errors.array().forEach((err) => {
      errorObj[err.path] = err.msg;
    });
    return res.status(400).json({
      message: "Validation failed",
      errors: errorObj,
    });
  }
  next();
};
