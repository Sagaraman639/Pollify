import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 w-full max-w-[1500px] items-center justify-between gap-6 px-[clamp(1.5rem,4vw,5rem)]">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
              P
            </span>
            <span className="text-xl font-black tracking-tight text-slate-950">
              Pollify
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-[clamp(1.5rem,4vw,5rem)] py-12 lg:py-16">
        <section className="mb-10 grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/6 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Welcome, {user?.name || "there"}.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Create, manage, share, and analyze your polls from one focused workspace.
            </p>
          </div>
          <Link
            to="/create-poll"
            className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Create new poll
          </Link>
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          <Link
            to="/create-poll"
            className="group rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8"
          >
            <div className="mb-8 h-1.5 w-16 rounded-full bg-emerald-500" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Create
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950 group-hover:text-emerald-700">
              Create New Poll
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Design a poll with custom questions, options, privacy settings, and expiration.
            </p>
          </Link>

          <Link
            to="/my-polls"
            className="group rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8"
          >
            <div className="mb-8 h-1.5 w-16 rounded-full bg-sky-500" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">
              Manage
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950 group-hover:text-sky-700">
              My Polls
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Track active polls, copy share links, publish results, and open analytics.
            </p>
          </Link>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            ["Unlimited", "Poll creation", "Build as many polls as your workflow needs."],
            ["Real-time", "Results", "Read live response trends as people submit."],
            ["Shareable", "Public links", "Send polls anywhere with simple public URLs."],
          ].map(([value, label, description]) => (
            <article key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-slate-950">{value}</p>
              <h3 className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                {label}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
