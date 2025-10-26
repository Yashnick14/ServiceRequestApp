import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const ServiceRequest = sequelize.define("ServiceRequest", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  pickup_location: { type: DataTypes.STRING, allowNull: false },
  dropoff_location: { type: DataTypes.STRING, allowNull: false },
  pickup_time: { type: DataTypes.DATE, allowNull: false },
  passengers: { type: DataTypes.INTEGER, allowNull: false },
  notes: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "scheduled"),
    defaultValue: "pending",
  },
});

export default ServiceRequest;
