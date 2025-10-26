import Driver from "../models/Driver.js";

// Get all drivers (read-only, admin only)
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      attributes: ["id", "name", "age", "phone"],
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      message: "Drivers fetched successfully",
      total: drivers.length,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drivers",
      errors: { server: error.message },
    });
  }
};
