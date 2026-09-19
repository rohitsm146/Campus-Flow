const express = require("express");

const {
  joinClub,
  getMyClubMemberships,
  getAllClubMemberships,
  approveClubMembership,
  rejectClubMembership,
} = require("../controllers/clubMembershipController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// STUDENT ROUTES

// Join a club
router.post("/", protect, joinClub);

// Get logged-in student's club memberships
router.get("/my", protect, getMyClubMemberships);


// ADMIN ROUTES

// Get all club membership requests
router.get("/", protect, admin, getAllClubMemberships);

// Approve a club membership request
router.put(
  "/:id/approve",
  protect,
  admin,
  approveClubMembership
);

// Reject a club membership request
router.put(
  "/:id/reject",
  protect,
  admin,
  rejectClubMembership
);

module.exports = router;