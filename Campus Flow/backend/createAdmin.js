require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    const email = "admin@campusflow.com";
    const password = "Admin@123";
    const name = "Campus Flow Admin";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();

      console.log("Existing user promoted to admin.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin user created successfully.");
    }

    console.log("Admin Email:", email);
    console.log("Admin Password:", password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:");
    console.error(error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();