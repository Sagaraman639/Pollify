const Poll = require("../models/Poll");
const Response = require("../models/Response");

const getPollAnalytics = async (req,res) => {

  try {

    const pollId = req.params.pollId;

    const poll = await Poll.findById(
      pollId
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }


    const responses =
      await Response.find({ pollId });


    // TOTAL RESPONSES
    const totalResponses =
      responses.length;


    // QUESTION ANALYTICS
    const questionAnalytics =
      poll.questions.map((question) => {

        const optionCounts = {};

        question.options.forEach((option) => {
          optionCounts[option] = 0;
        });


        responses.forEach((response) => {

          const answer =
            response.answers.find(
              (a) =>
                a.questionId.toString() ===
                question._id.toString()
            );

          if (answer) {
            optionCounts[
              answer.selectedOption
            ] += 1;
          }
        });


        return {
          questionId: question._id,
          questionText:
            question.questionText,
          optionCounts,
        };
      });


    res.json({
      totalResponses,
      questionAnalytics,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const getPublicResults = async (req,res) => {

  try {

    const poll = await Poll.findById(
      req.params.pollId
    );

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    if (!poll.resultsPublished) {
      return res.status(403).json({
        message:
          "Results are not published yet",
      });
    }

    const responses =
      await Response.find({
        pollId: poll._id,
      });

    const totalResponses =
      responses.length;

    const questionAnalytics =
      poll.questions.map((question) => {

        const optionCounts = {};

        question.options.forEach((option) => {
          optionCounts[option] = 0;
        });

        responses.forEach((response) => {

          const answer =
            response.answers.find(
              (a) =>
                a.questionId.toString() ===
                question._id.toString()
            );

          if (answer) {
            optionCounts[
              answer.selectedOption
            ] += 1;
          }
        });

        return {
          questionText:
            question.questionText,
          optionCounts,
        };
      });

    res.json({
      pollTitle: poll.title,
      totalResponses,
      questionAnalytics,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPollAnalytics,
  getPublicResults,
};