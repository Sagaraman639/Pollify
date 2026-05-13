import { Link } from "react-router-dom";

const features = [
  {
    title: "Launch polished polls fast",
    description:
      "Create opinion polls, event votes, product checks, and classroom questions in a clean builder made for everyday teams.",
  },
  {
    title: "Collect responses anywhere",
    description:
      "Share a public link, keep votes anonymous when needed, and make it simple for people to respond on any device.",
  },
  {
    title: "Read results in real time",
    description:
      "Watch answer trends update live so you can move from audience feedback to confident decisions without manual reports.",
  },
];

const useCases = [
  "Audience engagement",
  "Event planning",
  "Market research",
  "Product validation",
  "Classroom feedback",
  "Team decisions",
];

const steps = [
  {
    number: "01",
    title: "Ask",
    description: "Write one focused question and add clear answer choices.",
  },
  {
    number: "02",
    title: "Share",
    description: "Send your poll link to customers, students, teammates, or followers.",
  },
  {
    number: "03",
    title: "Decide",
    description: "Review the live result split and use the signal while it is fresh.",
  },
];

const pageShell =
  "mx-auto w-full max-w-[1500px] px-[clamp(1.5rem,4vw,5rem)]";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-stone-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-none backdrop-blur-xl">
        <nav className={`${pageShell} flex min-h-20 items-center justify-between gap-8`}>
          <Link to="/" className="flex items-center gap-3" aria-label="Pollify home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
              P
            </span>
            <span className="text-xl font-black tracking-tight text-slate-950">
              Pollify
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-slate-950">
              Workflow
            </a>
            <a href="#use-cases" className="transition hover:text-slate-950">
              Use cases
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Sign up free
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative border-b border-slate-200 bg-white">
          <div className={`${pageShell} grid min-h-[calc(100vh-5rem)] items-center gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24 xl:py-28`}>
            <div className="max-w-4xl min-w-0">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                Online poll maker
              </div>

              <h1 className="max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                Create polls that turn quick feedback into clear decisions.
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Pollify helps you create a poll in minutes, share it with your audience,
                and watch trustworthy results come together in real time.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                >
                  Create your first poll
                </Link>
                <Link
                  to="/login"
                  className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-8 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  View dashboard
                </Link>
              </div>

              <div className="mt-14 grid max-w-3xl grid-cols-1 gap-6 border-t border-slate-200 pt-9 sm:grid-cols-3">
                {[
                  ["2 min", "to launch"],
                  ["Live", "results"],
                  ["Any", "device"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-slate-950 sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
              <div className="absolute -left-8 top-10 hidden h-28 w-28 rounded-full bg-amber-300/50 blur-2xl sm:block" />
              <div className="absolute -right-10 bottom-10 hidden h-36 w-36 rounded-full bg-emerald-300/50 blur-2xl sm:block" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/12">
                <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Live poll
                    </p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      Which feature should ship next?
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                    348 votes
                  </span>
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                  {[
                    ["Team analytics", "52%", "bg-emerald-500"],
                    ["Private polls", "31%", "bg-sky-500"],
                    ["QR sharing", "17%", "bg-amber-400"],
                  ].map(([label, percent, color]) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="text-sm font-black text-slate-800">
                          {label}
                        </span>
                        <span className="text-sm font-black text-slate-950">
                          {percent}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${color}`} style={{ width: percent }} />
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="rounded-xl bg-slate-950 p-5 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Completion
                      </p>
                      <p className="mt-3 text-3xl font-black">91%</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                        Avg. time
                      </p>
                      <p className="mt-3 text-3xl font-black text-slate-950">
                        23s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-stone-50 py-24 lg:py-32">
          <div className={pageShell}>
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                Fast feedback
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Everything a modern poll needs, without slowing people down.
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3 xl:gap-8">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8"
                >
                  <div className="mb-8 h-1.5 w-14 rounded-full bg-emerald-500" />
                  <h3 className="text-xl font-black text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-slate-200 bg-white py-24 lg:py-32">
          <div className={pageShell}>
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start xl:gap-20">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                  Simple workflow
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Ask once. Share everywhere. Act while it matters.
                </h2>
              </div>

              <div className="grid gap-4">
                {steps.map((step) => (
                  <article
                    key={step.number}
                    className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[5rem_1fr] sm:p-7"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-slate-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="bg-slate-950 py-24 text-white lg:py-32">
          <div className={pageShell}>
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-20">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                  Use cases
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  A quick poll can move a serious decision forward.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                  From team planning to customer discovery, Pollify gives you a lightweight
                  way to capture the opinion that would otherwise stay scattered.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {useCases.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-6 py-5 text-sm font-black text-white shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 lg:py-32">
          <div className={pageShell}>
            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50 lg:grid-cols-[1fr_auto]">
              <div className="p-8 sm:p-10 lg:p-14">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-800">
                  Ready to start?
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Build your first poll and start seeing responses today.
                </h2>
              </div>
              <div className="flex items-center p-8 pt-0 sm:p-10 sm:pt-0 lg:p-14">
                <Link
                  to="/register"
                  className="inline-flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 sm:w-auto"
                >
                  Sign up free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className={`${pageShell} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
          <div>
            <p className="text-lg font-black text-slate-950">Pollify</p>
            <p className="mt-1 text-sm text-slate-500">
              Production-ready polling for quick, confident decisions.
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Copyright 2026 Pollify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
