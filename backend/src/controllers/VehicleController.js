import Vehicle from "../models/Vehicle.js";

// Get all vehicles (read-only, admin only)
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      attributes: ["id", "plate", "type", "capacity"],
      order: [["plate", "ASC"]],
    });

    res.status(200).json({
      message: "Vehicles fetched successfully",
      total: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicles",
      errors: { server: error.message },
    });
  }
};
