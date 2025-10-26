import Assignment from "../models/Assignment.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";

export const createOrUpdateAssignment = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { driver_id, vehicle_id, scheduled_time } = req.body;

    // Request must exist
    const request = await ServiceRequest.findByPk(request_id);
    if (!request) {
      return res.status(404).json({
        message: "Validation failed",
        errors: { request_id: "Service request not found" },
      });
    }

    // Check if driver and vehicle exist
    const driver = await Driver.findByPk(driver_id);
    if (!driver) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { driver_id: "Driver not found" },
      });
    }

    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { vehicle_id: "Vehicle not found" },
      });
    }

    // Ensure scheduled time is in the future
    if (new Date(scheduled_time) < new Date()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { scheduled_time: "Scheduled time must be in the future" },
      });
    }

    // Create or update assignment
    let assignment = await Assignment.findOne({ where: { request_id } });

    if (assignment) {
      assignment.driver_id = driver_id;
      assignment.vehicle_id = vehicle_id;
      assignment.scheduled_time = scheduled_time;
      await assignment.save();
    } else {
      assignment = await Assignment.create({
        request_id,
        driver_id,
        vehicle_id,
        scheduled_time,
      });
    }

    // Update related request status
    request.status = "scheduled";
    await request.save();

    res.status(200).json({
      message: "Request scheduled successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to schedule request",
      errors: { server: error.message },
    });
  }
};
