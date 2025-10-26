import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js";

const Driver = sequelize.define("Driver", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
});

export default Driver;
