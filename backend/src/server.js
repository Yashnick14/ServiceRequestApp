import app from "./app.js";
import sequelize from "./config/Database.js";
import "./models/ServiceRequest.js";
import "./models/Driver.js";
import "./models/Vehicle.js";
import "./models/Assignment.js";
import { seedData } from "./seed.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true });
    console.log("All models synced successfully!");

    //Seed data
    await seedData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
