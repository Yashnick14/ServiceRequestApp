import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middleware/LoggerMiddleware.js";
import authRoutes from "./routes/AuthRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";
import assignmentRoutes from "./routes/AssignmentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/assignments", assignmentRoutes);

export default app;
