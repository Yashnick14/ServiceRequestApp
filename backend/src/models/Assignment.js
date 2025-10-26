import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";
import ServiceRequest from "./ServiceRequest.js";
import Driver from "./Driver.js";
import Vehicle from "./Vehicle.js";

const Assignment = sequelize.define("Assignment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  scheduled_time: { type: DataTypes.DATE, allowNull: false },
});

// Relationships
Assignment.belongsTo(ServiceRequest, { foreignKey: "request_id" });
Assignment.belongsTo(Driver, { foreignKey: "driver_id" });
Assignment.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

ServiceRequest.hasOne(Assignment, { foreignKey: "request_id" });

export default Assignment;
