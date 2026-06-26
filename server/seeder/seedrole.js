const Role = require("../models/rolemodule");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Roles = [
  {
    role: "admin",
    roleDesription:
      "manage users. assing flat to resident, generate bill, manage compaints",
  },
  {
    role: "resident",
    roleDesription:
      "Raise compaints, track thier complaints, accept visitor entry",
  },
  {
    role: "security-guard",
    roleDesription: "visiter log,accept visiter entry",
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected Successfully");
    
    // Clear existing roles to avoid duplicates
    await Role.deleteMany({});
    console.log("Cleared existing roles.");

    const newRoles = await Role.insertMany(Roles);
    console.log("Successfully seeded roles:", newRoles);
  } catch (error) {
    console.log("Error seeding roles:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedRoles();
