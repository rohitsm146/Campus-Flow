const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    facultyCoordinator: {
      type: String,
      required: true,
      trim: true,
    },
    studentCoordinator: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Club", clubSchema);