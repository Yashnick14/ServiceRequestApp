import express from "express";
import cors from "cors";

import authRoutes from "./routes/AuthRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";
import assignmentRoutes from "./routes/AssignmentRoutes.js";
import analyticsRoutes from "./routes/AnalyticsRoutes.js";
import loggerMiddleware from "./middleware/LoggerMiddleware.js";
import driverRoutes from "./routes/DriverRoutes.js";
import vehicleRoutes from "./routes/VehicleRoutes.js";

const app = express();

// --------------------------- Middleware ---------------------------

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// --------------------------- API Routes ---------------------------

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);

// --------------------------- Default Route ---------------------------

app.get("/", (req, res) => {
  res.send("Coach Service API is running...");
});

export default app;
