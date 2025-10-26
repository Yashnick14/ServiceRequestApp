import ServiceRequest from "../models/ServiceRequest.js";
import { Op } from "sequelize";

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

    // Business logic validation
    if (new Date(pickup_time) < new Date()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { pickup_time: "Pickup time must be in the future" },
      });
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

    res.status(201).json({
      message: "Trip request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service request",
      errors: { server: error.message },
    });
  }
};

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

    res.status(200).json({
      message: "Requests fetched successfully",
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      errors: { server: error.message },
    });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected", "scheduled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Validation failed",
        errors: { status: "Invalid status value" },
      });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        message: "Validation failed",
        errors: { request: "Service request not found" },
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      errors: { server: error.message },
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceRequest.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        message: "Validation failed",
        errors: { request: "Service request not found" },
      });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete request",
      errors: { server: error.message },
    });
  }
};
