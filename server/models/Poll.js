const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  options: [
    {
      type: String,
      required: true,
    },
  ],

  isRequired: {
    type: Boolean,
    default: false,
  },
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isAnonymous: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    resultsPublished: {
    type: Boolean,
    default: false,
    },

    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poll", pollSchema);