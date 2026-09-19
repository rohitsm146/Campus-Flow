const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Prevent the same student from registering for the same event twice
eventRegistrationSchema.index(
  { event: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);