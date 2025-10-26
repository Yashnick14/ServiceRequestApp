import ServiceRequest from "../models/ServiceRequest.js";
import { Op } from "sequelize";

// Create a new service request (customer)
export const createRequest = async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      pickup_location,
      dropoff_location,
      pickup_time,
      passengers,
      notes,
    } = req.body;

    if (
      !customer_name ||
      !phone ||
      !pickup_location ||
      !dropoff_location ||
      !pickup_time ||
      !passengers
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const newRequest = await ServiceRequest.create({
      customer_name,
      phone,
      pickup_location,
      dropoff_location,
      pickup_time,
      passengers,
      notes,
    });

    res
      .status(201)
      .json({
        message: "Trip request submitted successfully",
        request: newRequest,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create request", error: error.message });
  }
};

// Get all service requests (admin only, with pagination + search)
export const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { customer_name: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await ServiceRequest.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      requests: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

// Update request status (approve/reject/schedule)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected", "scheduled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ message: "Request status updated successfully", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};

// Delete request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceRequest.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete request", error: error.message });
  }
};
