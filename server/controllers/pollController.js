const Poll = require("../models/Poll");


// CREATE POLL
const createPoll = async (req, res) => {
  try {

    const {
      title,
      description,
      isAnonymous,
      expiresAt,
      questions,
    } = req.body;


    if (!title || !expiresAt || !questions?.length) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }


    const formattedQuestions = questions.map((q) => {

      if (!q.questionText) {
        throw new Error("Question text required");
      }

      if (!q.options || q.options.length < 2) {
        throw new Error(
          "Each question must have at least 2 options"
        );
      }

      return {
        questionText: q.questionText,
        options: q.options,
        isRequired: q.isRequired || false,
      };
    });


    const poll = await Poll.create({
      title,
      description,
      isAnonymous,
      expiresAt,
      questions: formattedQuestions,
      createdBy: req.user._id,
    });

    res.status(201).json(poll);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET MY POLLS
const getMyPolls = async (req, res) => {
  try {

    const polls = await Poll.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(polls);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE POLL
const getPollById = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    res.json(poll);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const publishResults = async (req,res) => {

  try {

    const poll = await Poll.findById(
      req.params.id
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // OWNER CHECK
    if (
      poll.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    poll.resultsPublished = true;

    await poll.save();

    res.json({
      message:
        "Results published successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPoll,
  getMyPolls,
  getPollById,
  publishResults,
};