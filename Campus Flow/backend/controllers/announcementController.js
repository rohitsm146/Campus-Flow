const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const announcement = await Announcement.create({
      title,
      description,
    });

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      createdAt: -1,
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    res.json({
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.id
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    res.json({
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};