const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student + Admin
router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);

// Admin only
router.get("/", protect, admin, getAllComplaints);
router.put("/:id/status", protect, admin, updateComplaintStatus);

module.exports = router;