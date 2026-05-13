const express = require("express");

const {
  getPollAnalytics,
  getPublicResults,
} = require(
  "../controllers/analyticsController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/:pollId",
  protect,
  getPollAnalytics
);

router.get(
  "/public/:pollId",
  getPublicResults
);

module.exports = router;