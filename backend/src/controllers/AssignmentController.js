import Assignment from "../models/Assignment.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";

export const createOrUpdateAssignment = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { driver_id, vehicle_id, scheduled_time } = req.body;

    // Validate request existence
    const request = await ServiceRequest.findByPk(request_id);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // Validate driver and vehicle existence
    const driver = await Driver.findByPk(driver_id);
    const vehicle = await Vehicle.findByPk(vehicle_id);

    if (!driver || !vehicle) {
      return res.status(400).json({ message: "Invalid driver or vehicle" });
    }

    // Create or update assignment
    const [assignment] = await Assignment.upsert({
      request_id,
      driver_id,
      vehicle_id,
      scheduled_time,
    });

    // Update request status
    request.status = "scheduled";
    await request.save();

    res.json({
      message: "Request scheduled successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to schedule request",
      error: error.message,
    });
  }
};
