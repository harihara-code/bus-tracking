import { getBusLocations } from "../services/BusLocationService.js";

export function handleGetBusLocationsRequest(req, res) {
    res.json(getBusLocations());
}