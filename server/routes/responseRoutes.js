const express = require("express");

const {
  submitResponse,
} = require("../controllers/responseController");

const optionalAuth = require(
  "../middleware/optionalAuth"
);

const router = express.Router();

router.post(
  "/:pollId",
  optionalAuth,
  submitResponse
);

module.exports = router;