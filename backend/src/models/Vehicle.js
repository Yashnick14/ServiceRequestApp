import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const Vehicle = sequelize.define("Vehicle", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  plate: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
});

export default Vehicle;
