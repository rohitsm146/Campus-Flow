const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
} = require("../controllers/eventRegistrationController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// STUDENT ROUTES
router.post("/", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);

// ADMIN ROUTE
router.get("/event/:eventId", protect, admin, getEventRegistrations);

module.exports = router;