const mongoose = require("mongoose");

const clubMembershipSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

clubMembershipSchema.index(
  { club: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ClubMembership",
  clubMembershipSchema
);