import Driver from "./models/Driver.js";
import Vehicle from "./models/Vehicle.js";

export const seedData = async () => {
  try {
    // Seed Drivers
    const driverCount = await Driver.count();
    if (driverCount === 0) {
      await Driver.bulkCreate([
        { name: "John Doe", phone: "0711111111", age: 35 },
        { name: "Alex Smith", phone: "0722222222", age: 40 },
        { name: "Chris Lee", phone: "0733333333", age: 29 },
      ]);
      console.log("Seeded 3 drivers");
    }

    // Seed Vehicles
    const vehicleCount = await Vehicle.count();
    if (vehicleCount === 0) {
      await Vehicle.bulkCreate([
        { plate: "AB-1234", capacity: 12, type: "Toyota Hiace" },
        { plate: "BC-5678", capacity: 24, type: "Nissan Caravan" },
        { plate: "CD-9012", capacity: 18, type: "Honda Civic" },
      ]);
      console.log("Seeded 3 vehicles");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};
