const Poll = require("../models/Poll");
const Response = require("../models/Response");


// SUBMIT RESPONSE
const submitResponse = async (
  req,
  res
) => {

  try {

    const pollId = req.params.pollId;

    const { answers } = req.body;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }


    // CHECK EXPIRY
    if (new Date() > new Date(poll.expiresAt)) {
      return res.status(400).json({
        message: "Poll expired",
      });
    }


    // AUTHENTICATED POLL
    if (!poll.isAnonymous && !req.user) {
      return res.status(401).json({
        message:
          "Login required for this poll",
      });
    }


    // DUPLICATE SUBMISSION
    if (req.user) {

      const alreadySubmitted =
        await Response.findOne({
          pollId,
          userId: req.user._id,
        });

      if (alreadySubmitted) {
        return res.status(400).json({
          message:
            "You already submitted this poll",
        });
      }
    }


    // VALIDATE ANSWERS
    for (const question of poll.questions) {

      const userAnswer = answers.find(
        (a) =>
          a.questionId ===
          question._id.toString()
      );


      // REQUIRED VALIDATION
      if (
        question.isRequired &&
        !userAnswer
      ) {
        return res.status(400).json({
          message: `${question.questionText} is required`,
        });
      }


      // VALID OPTION CHECK
      if (
        userAnswer &&
        !question.options.includes(
          userAnswer.selectedOption
        )
      ) {
        return res.status(400).json({
          message: "Invalid option selected",
        });
      }
    }
if (poll.resultsPublished) {
  return res.status(400).json({
    message:
      "Poll results already published. Responses closed.",
  });
}

    // CREATE RESPONSE
    const response =
      await Response.create({
        pollId,
        userId: req.user
          ? req.user._id
          : null,
        answers,
      });


    // SOCKET EVENT
    const io = req.app.get("io");

    io.to(pollId).emit(
      "response_submitted",
      {
        pollId,
      }
    );


    res.status(201).json({
      message: "Response submitted",
      response,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitResponse,
};