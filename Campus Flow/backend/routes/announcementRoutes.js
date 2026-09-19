const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student + Admin
router.get("/", protect, getAnnouncements);

// Admin only
router.post("/", protect, admin, createAnnouncement);
router.put("/:id", protect, admin, updateAnnouncement);
router.delete("/:id", protect, admin, deleteAnnouncement);

module.exports = router;