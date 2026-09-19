const ClubMembership = require("../models/ClubMembership");
const Club = require("../models/Club");

// STUDENT: Join a club
const joinClub = async (req, res) => {
  try {
    const { clubId } = req.body;

    if (!clubId) {
      return res.status(400).json({
        message: "Club ID is required.",
      });
    }

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        message: "Club not found.",
      });
    }

    const existingMembership = await ClubMembership.findOne({
      club: clubId,
      student: req.user.id,
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "You have already requested to join this club.",
      });
    }

    const membership = await ClubMembership.create({
      club: clubId,
      student: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      message: "Club join request submitted successfully.",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// STUDENT: Get my club memberships
const getMyClubMemberships = async (req, res) => {
  try {
    const memberships = await ClubMembership.find({
      student: req.user.id,
    })
      .populate("club")
      .sort({ requestedAt: -1 });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ADMIN: Get all club membership requests
const getAllClubMemberships = async (req, res) => {
  try {
    const memberships = await ClubMembership.find()
      .populate("club")
      .populate("student", "name email")
      .sort({ requestedAt: -1 });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ADMIN: Approve club membership
const approveClubMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await ClubMembership.findById(id);

    if (!membership) {
      return res.status(404).json({
        message: "Club membership request not found.",
      });
    }

    membership.status = "approved";

    await membership.save();

    const updatedMembership = await ClubMembership.findById(id)
      .populate("club")
      .populate("student", "name email");

    res.json({
      message: "Club membership approved successfully.",
      membership: updatedMembership,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ADMIN: Reject club membership
const rejectClubMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await ClubMembership.findById(id);

    if (!membership) {
      return res.status(404).json({
        message: "Club membership request not found.",
      });
    }

    membership.status = "rejected";

    await membership.save();

    const updatedMembership = await ClubMembership.findById(id)
      .populate("club")
      .populate("student", "name email");

    res.json({
      message: "Club membership rejected successfully.",
      membership: updatedMembership,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  joinClub,
  getMyClubMemberships,
  getAllClubMemberships,
  approveClubMembership,
  rejectClubMembership,
};