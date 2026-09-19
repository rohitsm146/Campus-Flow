const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");

// STUDENT: Register for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required.",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      student: req.user.id,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event.",
      });
    }

    const registration = await EventRegistration.create({
      event: eventId,
      student: req.user.id,
    });

    res.status(201).json({
      message: "Event registration successful.",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// STUDENT: Get my event registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      student: req.user.id,
    })
      .populate("event")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ADMIN: Get students registered for a particular event
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const registrations = await EventRegistration.find({
      event: eventId,
    })
      .populate("student", "name email")
      .sort({ registeredAt: -1 });

    res.json({
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        time: event.time,
      },
      totalRegistrations: registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
};