import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middleware/LoggerMiddleware.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api", routes);

export default app;
