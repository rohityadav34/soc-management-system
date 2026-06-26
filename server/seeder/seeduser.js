const User = require("../models/usermodule");
const Role = require("../models/rolemodule");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seeduser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected Successfully");

    // Fetch the admin role dynamically
    const adminRole = await Role.findOne({ role: "admin" });
    if (!adminRole) {
      console.log("Admin role not found. Please run seedrole.js first!");
      return;
    }

    // Clear existing admin user if any
    await User.deleteMany({ email: "yadavrohit@gmail.com" });

    const hashedPassword = await bcrypt.hash("password123", 12);

    const user = {
      name: "System Admin",
      email: "yadavrohit@gmail.com",
      password: hashedPassword,
      role: adminRole._id,
      isActive: true,
    };

    const newUser = await User.create(user);
    console.log("Admin User seeded successfully:", newUser);
  } catch (error) {
    console.log("Error seeding admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

seeduser();