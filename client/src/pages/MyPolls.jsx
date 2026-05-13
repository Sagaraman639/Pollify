import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const badgeClass =
  "rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-600";

const MyPolls = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/polls/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pollsWithAnalytics = await Promise.all(
          res.data.map(async (poll) => {
            try {
              const analyticsRes = await api.get(`/analytics/${poll._id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              return {
                ...poll,
                totalResponses: analyticsRes.data.totalResponses,
              };
            } catch (error) {
              console.log(error);
              return {
                ...poll,
                totalResponses: 0,
              };
            }
          })
        );

        setPolls(pollsWithAnalytics);
        setError("");
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Failed to fetch polls");
      }
      setLoading(false);
    };

    fetchPolls();
  }, []);

  const handleCopyLink = (pollId) => {
    const link = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(link);
    showToast("Poll link copied to clipboard.");
  };

  const handlePublishResults = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/polls/${pollId}/publish-results`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Results published successfully.");
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === pollId
            ? {
                ...poll,
                resultsPublished: true,
              }
            : poll
        )
      );
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to publish results.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <h1 className="text-2xl font-black">Loading Polls...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">Error</p>
          <h1 className="mt-3 text-2xl font-black text-slate-950">Unable to load polls</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-[60] max-w-sm rounded-xl border bg-white px-5 py-4 text-sm font-black shadow-2xl shadow-slate-950/15 ${
            toast.type === "error"
              ? "border-red-200 text-red-700"
              : "border-emerald-200 text-emerald-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="mx-auto w-full max-w-[1500px] px-[clamp(1.5rem,4vw,5rem)] py-10 lg:py-14">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Manage
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              My Polls
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Manage active polls, share links, publish results, and open analytics.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
              aria-label="Go back"
            >
              Dashboard
            </button>
            <Link
              to="/create-poll"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              New Poll
            </Link>
          </div>
        </div>

        {polls.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Empty workspace
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-950">No polls yet</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Create your first poll to start collecting responses and tracking live results.
            </p>
            <Link
              to="/create-poll"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white"
            >
              Create Your First Poll
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => {
              const isExpired = new Date() > new Date(poll.expiresAt);
              const totalResponses = poll.totalResponses || 0;

              return (
                <article key={poll._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <h2 className="text-2xl font-black text-slate-950">{poll.title}</h2>
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                            isExpired
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {isExpired ? "Expired" : "Active"}
                        </span>
                      </div>

                      {poll.description && (
                        <p className="mb-5 max-w-3xl text-sm leading-7 text-slate-600">
                          {poll.description}
                        </p>
                      )}

                      <div className="mb-5 flex flex-wrap gap-2">
                        <span className={badgeClass}>{poll.questions.length} Questions</span>
                        <span className={badgeClass}>{totalResponses} Responses</span>
                        <span className={badgeClass}>
                          {poll.isAnonymous ? "Anonymous" : "Authenticated"}
                        </span>
                        {poll.resultsPublished && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-800">
                            Results Published
                          </span>
                        )}
                      </div>

                      <div className="grid gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-2">
                        <p>Created: {new Date(poll.createdAt).toLocaleString()}</p>
                        <p>Expires: {new Date(poll.expiresAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid h-fit grid-cols-2 gap-3 sm:grid-cols-3 lg:w-52 lg:grid-cols-1">
                      <a
                        href={`/poll/${poll._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-black text-white"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => handleCopyLink(poll._id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950"
                      >
                        Copy Link
                      </button>
                      <Link
                        to={`/analytics/${poll._id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-black text-slate-800"
                      >
                        Analytics
                      </Link>
                      {!poll.resultsPublished ? (
                        <button
                          onClick={() => handlePublishResults(poll._id)}
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-black text-sky-800"
                        >
                          Publish
                        </button>
                      ) : (
                        <a
                          href={`/results/${poll._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-black text-amber-800"
                        >
                          Results
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-7 border-t border-slate-200 pt-6">
                    <h3 className="mb-4 text-lg font-black text-slate-950">Questions Preview</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {poll.questions.map((question, index) => (
                        <div key={question._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-3 flex gap-3">
                            <span className="text-sm font-black text-emerald-700">Q{index + 1}</span>
                            <div>
                              <p className="text-sm font-black text-slate-900">
                                {question.questionText}
                              </p>
                              {question.isRequired && (
                                <span className="mt-2 inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-black text-red-700">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {question.options.slice(0, 2).map((option, i) => (
                              <span key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                                {option}
                              </span>
                            ))}
                            {question.options.length > 2 && (
                              <span className="px-3 py-1 text-xs font-bold text-slate-500">
                                +{question.options.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPolls;
