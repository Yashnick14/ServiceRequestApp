import ServiceRequest from "../models/ServiceRequest.js";
import { Sequelize } from "sequelize";

export const getDailyAnalytics = async (req, res) => {
  try {
    const analytics = await ServiceRequest.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["date"],
      order: [[Sequelize.literal("date"), "DESC"]],
      limit: 7,
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics data",
      error: error.message,
    });
  }
};
