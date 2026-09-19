require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const eventRegistrationRoutes = require("./routes/eventRegistrationRoutes");
const clubRoutes = require("./routes/clubRoutes");
const clubMembershipRoutes = require("./routes/clubMembershipRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/club-memberships", clubMembershipRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/complaints", complaintRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});