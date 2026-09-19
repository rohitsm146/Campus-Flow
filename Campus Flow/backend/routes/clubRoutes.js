const express = require("express");

const {
  createClub,
  getClubs,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student + Admin
router.get("/", protect, getClubs);

// Admin only
router.post("/", protect, admin, createClub);
router.put("/:id", protect, admin, updateClub);
router.delete("/:id", protect, admin, deleteClub);

module.exports = router;