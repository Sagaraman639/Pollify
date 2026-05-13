import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";

const PublicPoll = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await api.get(`/polls/${id}`);
        setPoll(res.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchPoll();
  }, [id]);

  const handleSelect = (questionId, option) => {
    const existing = answers.find((a) => a.questionId === questionId);

    if (existing) {
      setAnswers(
        answers.map((a) =>
          a.questionId === questionId
            ? {
                ...a,
                selectedOption: option,
              }
            : a
        )
      );
    } else {
      setAnswers([
        ...answers,
        {
          questionId,
          selectedOption: option,
        },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (poll && new Date() > new Date(poll.expiresAt)) {
      showToast("This poll has expired.");
      return;
    }

    const unansweredRequiredQuestion = poll.questions.find(
      (question) =>
        question.isRequired &&
        !answers.some((answer) => answer.questionId === question._id)
    );

    if (unansweredRequiredQuestion) {
      showToast("Please answer all required questions before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/responses/${id}`,
        {
          answers,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setSubmitted(true);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Unable to submit your response."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <h1 className="text-2xl font-black">Loading poll...</h1>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
            Not found
          </p>
          <h1 className="mt-3 text-2xl font-black">Poll not found</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This poll may have been removed or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = new Date() > new Date(poll.expiresAt);
  const answeredCount = poll.questions.filter((question) =>
    answers.some((answer) => answer.questionId === question._id)
  ).length;
  const progressPercent =
    poll.questions.length === 0
      ? 0
      : Math.round((answeredCount / poll.questions.length) * 100);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Submitted
          </p>
          <h1 className="mt-3 text-3xl font-black">Thank you.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Your response has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-[clamp(1.5rem,4vw,5rem)] py-10 text-slate-950">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-[60] max-w-sm rounded-xl border bg-white px-5 py-4 text-sm font-black shadow-2xl shadow-slate-950/15 ${
            toast.type === "success"
              ? "border-emerald-200 text-emerald-800"
              : "border-red-200 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="mx-auto grid w-full max-w-[1320px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/8 lg:sticky lg:top-10">
          <div className="bg-slate-950 p-7 text-white">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Public poll
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight !text-white">
              {poll.title}
            </h1>
            {poll.description && (
              <p className="mt-5 text-base leading-8 !text-slate-300">
                {poll.description}
              </p>
            )}
          </div>

          <div className="space-y-6 p-7">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Completion
                </p>
                <p className="text-sm font-black text-slate-950">
                  {answeredCount}/{poll.questions.length}
                </p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                {progressPercent}% answered
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Status
              </p>
              <p
                className={`mt-2 text-lg font-black ${
                  isExpired ? "text-red-700" : "text-emerald-700"
                }`}
              >
                {isExpired ? "Expired" : "Accepting responses"}
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/6 sm:p-7">
          {isExpired && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-black text-red-700">
              This poll has expired.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {poll.questions.map((question, index) => (
              <fieldset
                key={question._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 sm:p-6"
              >
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <legend className="text-xl font-black leading-7 text-slate-950">
                    <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    {question.questionText}
                    {question.isRequired && <span className="text-red-600"> *</span>}
                  </legend>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    Choose one
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {question.options.map((option, i) => {
                    const selected = answers.some(
                      (answer) =>
                        answer.questionId === question._id &&
                        answer.selectedOption === option
                    );

                    return (
                      <label
                        key={i}
                        className={`group flex min-h-20 cursor-pointer items-center gap-4 rounded-xl border p-4 text-sm font-bold transition sm:p-5 ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-slate-950 shadow-md shadow-emerald-500/10"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-md"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          required={question.isRequired}
                          onChange={() => handleSelect(question._id, option)}
                          className="peer sr-only"
                        />
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black transition ${
                            selected
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-300 bg-slate-50 text-slate-500 group-hover:border-emerald-400 group-hover:text-emerald-700"
                          }`}
                        >
                          {selected ? "✓" : String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 leading-6">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="sticky bottom-5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-950/12 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {answeredCount} of {poll.questions.length} questions answered
                </p>
                {!isExpired && (
                  <button className="inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto">
                    Submit Response
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default PublicPoll;
