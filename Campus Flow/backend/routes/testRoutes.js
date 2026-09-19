const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Campus Flow API is working!",
  });
});

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully!",
    user: req.user,
  });
});

module.exports = router;