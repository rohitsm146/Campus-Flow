const express = require("express");

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student + Admin
router.get("/", protect, getEvents);

// Admin only
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;