const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Infrastructure",
        "Hostel",
        "Library",
        "Transport",
        "Canteen",
        "Other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);