const express = require("express");

const {
  createPoll,
  getMyPolls,
  getPollById,
  publishResults,
} = require("../controllers/pollController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPoll);

router.get("/my", protect, getMyPolls);

router.get("/:id", getPollById);

router.put("/:id/publish-results",protect,publishResults);

module.exports = router;