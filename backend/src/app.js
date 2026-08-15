import express from "express";
import cors from "cors";
import BusLocationsRoutes from "./routes/bus.locations.routes.js";
import dotenv from "dotenv";
import { startBusLocationService } from "./services/BusLocationService.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/buslocations", BusLocationsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

startBusLocationService();