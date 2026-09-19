const Event = require("../models/Event");

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    if (!title || !description || !date || !time) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        date,
        time,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.json({
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
};