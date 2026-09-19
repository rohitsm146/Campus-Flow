const Club = require("../models/Club");

const createClub = async (req, res) => {
  try {
    const {
      clubName,
      description,
      facultyCoordinator,
      studentCoordinator,
    } = req.body;

    if (
      !clubName ||
      !description ||
      !facultyCoordinator ||
      !studentCoordinator
    ) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const club = await Club.create({
      clubName,
      description,
      facultyCoordinator,
      studentCoordinator,
    });

    res.status(201).json({
      message: "Club created successfully.",
      club,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });

    res.json(clubs);
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const updateClub = async (req, res) => {
  try {
    const {
      clubName,
      description,
      facultyCoordinator,
      studentCoordinator,
    } = req.body;

    const club = await Club.findByIdAndUpdate(
      req.params.id,
      {
        clubName,
        description,
        facultyCoordinator,
        studentCoordinator,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!club) {
      return res.status(404).json({
        message: "Club not found.",
      });
    }

    res.json({
      message: "Club updated successfully.",
      club,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return res.status(404).json({
        message: "Club not found.",
      });
    }

    res.json({
      message: "Club deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

module.exports = {
  createClub,
  getClubs,
  updateClub,
  deleteClub,
};