import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";

const socket = io(
  import.meta.env.VITE_API_URL.replace(
    "/api",
    ""
  )
);
const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/analytics/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalytics(res.data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [pollId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchAnalytics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchAnalytics]);

  useEffect(() => {
    socket.emit("join_poll", pollId);

    socket.on("response_submitted", () => {
      fetchAnalytics();
    });

    return () => {
      socket.off("response_submitted");
    };
  }, [fetchAnalytics, pollId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/8">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <h1 className="text-2xl font-black">Loading Analytics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <main className="mx-auto w-full max-w-[1500px] px-[clamp(1.5rem,4vw,5rem)] py-10 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Analytics
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Poll Analytics
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Live response analytics and option-level breakdowns.
            </p>
          </div>
          <button
            onClick={() => navigate("/my-polls")}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50"
            aria-label="Go back"
          >
            Back to polls
          </button>
        </div>

        <section className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-slate-950/8">
          <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
            <div className="p-8 sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                Total Responses
              </p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
                <h2 className="text-7xl font-black leading-none tracking-tight text-slate-950 sm:text-8xl">
                  {analytics.totalResponses}
                </h2>
                <p className="pb-2 text-base font-semibold leading-7 text-slate-600">
                  responses collected so far
                </p>
              </div>
            </div>

            <div className="border-t border-emerald-100 bg-emerald-50 p-8 sm:p-10 lg:min-w-80 lg:border-l lg:border-t-0">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-800">
                Live status
              </p>
              <p className="mt-4 text-2xl font-black text-slate-950">
                Tracking active responses
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This dashboard updates when new responses are submitted.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {analytics.questionAnalytics.map((question, index) => {
            const chartData = Object.entries(question.optionCounts).map(
              ([option, count]) => ({
                name: option,
                value: count,
              })
            );

            const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

            return (
              <article key={question.questionId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex gap-4 border-b border-slate-200 pb-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      {question.questionText}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {totalVotes} votes recorded for this question
                    </p>
                  </div>
                </div>

                <div className="mb-8 grid gap-6 xl:grid-cols-2">
                  <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 text-lg font-black text-slate-950">Distribution</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          outerRadius={105}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} votes`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="mb-4 text-lg font-black text-slate-950">Vote Counts</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 24, left: 0, bottom: 70 }}
                      >
                        <XAxis dataKey="name" angle={-35} textAnchor="end" height={90} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} votes`} />
                        <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </section>
                </div>

                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="mb-4 text-lg font-black text-slate-950">Breakdown</h3>
                  <div className="space-y-4">
                    {chartData.map((item, i) => {
                      const percentage =
                        totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : 0;

                      return (
                        <div key={i} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <span className="font-black text-slate-900">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-3 w-full min-w-40 overflow-hidden rounded-full bg-slate-200 sm:w-44">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[i % COLORS.length],
                                }}
                              />
                            </div>
                            <span className="w-24 text-right text-sm font-black text-slate-700">
                              {item.value} ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
