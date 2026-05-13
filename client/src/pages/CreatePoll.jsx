import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(null);

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", ""],
      isRequired: false,
    },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", ""],
        isRequired: false,
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setQuestions(updatedQuestions);
  };

  const scrollToError = () => {
    window.setTimeout(() => {
      errorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  const getValidationError = () => {
    if (!title.trim()) {
      return "Please enter a poll title.";
    }

    if (!expiresAt) {
      return "Please select an expiration date and time.";
    }

    const emptyQuestionIndex = questions.findIndex(
      (question) => !question.questionText.trim()
    );

    if (emptyQuestionIndex !== -1) {
      return `Please enter text for question ${emptyQuestionIndex + 1}.`;
    }

    const questionWithEmptyOptionIndex = questions.findIndex((question) =>
      question.options.some((option) => !option.trim())
    );

    if (questionWithEmptyOptionIndex !== -1) {
      return `Please fill all options for question ${
        questionWithEmptyOptionIndex + 1
      }.`;
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = getValidationError();

    if (validationError) {
      setError(validationError);
      scrollToError();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/polls",
        {
          title,
          description,
          isAnonymous,
          expiresAt,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-polls");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create poll");
      scrollToError();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <main className="mx-auto w-full max-w-[1400px] px-[clamp(1.5rem,4vw,5rem)] py-10 lg:py-14">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Poll builder
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Create Poll
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Set the poll details, add questions, and launch a clean voting experience.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            aria-label="Go back"
          >
            Back to dashboard
          </button>
        </div>

        {error && (
          <div
            ref={errorRef}
            className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-2xl font-black text-slate-950">Poll Details</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Give respondents enough context to answer confidently.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-black text-slate-900">
                  Poll title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Best JavaScript framework"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="min-h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-black text-slate-900">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add context or instructions for respondents"
                  className="min-h-28 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="expiresAt" className="mb-2 block text-sm font-black text-slate-900">
                  Expiration date
                </label>
                <input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => {
                    setExpiresAt(e.target.value);
                    e.currentTarget.blur();
                  }}
                  className="min-h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              <label
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${
                  isAnonymous
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>
                  <span className="block text-sm font-black text-slate-900">
                    Anonymous responses
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    Keep voters private when they submit this poll.
                  </span>
                </span>
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="peer sr-only"
                />
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-sm font-black text-white transition after:content-['✓'] after:opacity-0 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:after:opacity-100" />
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Questions</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Add multiple-choice questions with two or more options.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Add question
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <article key={qIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-black text-slate-950">Question {qIndex + 1}</h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Enter your question"
                      value={question.questionText}
                      required
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "questionText", e.target.value)
                      }
                      className="mb-4 min-h-12 rounded-lg border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-100"
                    />

                    <label
                      className={`mb-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${
                        question.isRequired
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black text-slate-900">
                          Required question
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-slate-500">
                          Respondents must answer this before submitting.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        id={`required-${qIndex}`}
                        checked={question.isRequired}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "isRequired", e.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-sm font-black text-white transition after:content-['✓'] after:opacity-0 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:after:opacity-100" />
                    </label>

                    <div className="space-y-3">
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                        Options
                      </p>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-3">
                          <input
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            required
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            className="min-h-12 flex-1 rounded-lg border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-100"
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="min-h-12 rounded-lg bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-600"
                              aria-label="Remove option"
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                    >
                      Add option
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-14 flex-1 items-center justify-center rounded-lg bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-4 text-sm font-black text-slate-800 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default CreatePoll;
