import express from "express";
import { handleGetBusLocationsRequest } from "../controllers/bus.locations.controller.js";

const router = express.Router();

router.get("/", handleGetBusLocationsRequest);

export default router;