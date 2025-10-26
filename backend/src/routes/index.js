import express from "express";
import { home } from "../controllers/SampleController.js";

const router = express.Router();
router.get("/", home);

export default router;
