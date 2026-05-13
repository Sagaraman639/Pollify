import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const PublicResults = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/analytics/public/${pollId}`);
        setResults(res.data);
      } catch (error) {
        setError(error?.response?.data?.message || "Unable to load results");
      }

      setLoading(false);
    };

    fetchResults();
  }, [pollId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <h1 className="text-2xl font-black">Loading Results...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">Error</p>
          <h1 className="mt-3 text-2xl font-black text-slate-950">Unable to load results</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <main className="mx-auto w-full max-w-[1400px] px-[clamp(1.5rem,4vw,5rem)] py-10 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Public results
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {results.pollTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Published response breakdown for this poll.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
            aria-label="Go back"
          >
            Back home
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/15">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
            Total Responses
          </p>
          <h2 className="mt-3 text-6xl font-black text-white">{results.totalResponses}</h2>
          <p className="mt-3 text-sm text-slate-300">people have responded</p>
        </section>

        <div className="space-y-7">
          {results.questionAnalytics.map((question, index) => {
            const totalVotes = Object.values(question.optionCounts).reduce(
              (a, b) => a + b,
              0
            );

            return (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7 flex gap-4 border-b border-slate-200 pb-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      {question.questionText}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Total votes for this question: {totalVotes}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(question.optionCounts).map(([option, count], optionIndex) => {
                    const percentage =
                      totalVotes === 0 ? 0 : ((count / totalVotes) * 100).toFixed(1);

                    return (
                      <div key={option} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-black text-slate-900">{option}</span>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">
                              {count} votes
                            </span>
                            <span className="min-w-16 text-right text-lg font-black text-slate-950">
                              {percentage}%
                            </span>
                          </div>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[optionIndex % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-800">
            Create your own poll
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white"
          >
            Go to Pollify
          </button>
        </section>
      </main>
    </div>
  );
};

export default PublicResults;
