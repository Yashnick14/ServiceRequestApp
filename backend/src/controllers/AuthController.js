import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const coordinatorEmail = process.env.COORDINATOR_EMAIL;
const coordinatorPasswordHash = bcrypt.hashSync(
  process.env.COORDINATOR_PASSWORD,
  10
);

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Business logic validation
    if (email !== coordinatorEmail) {
      return res.status(401).json({
        message: "Validation failed",
        errors: { credentials: "Invalid email or password" },
      });
    }

    const isMatch = await bcrypt.compare(password, coordinatorPasswordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Validation failed",
        errors: { credentials: "Invalid email or password" },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      errors: { server: error.message },
    });
  }
};
