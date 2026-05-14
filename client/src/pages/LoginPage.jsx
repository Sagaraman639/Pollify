import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const redirectPath = location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-[clamp(1.5rem,4vw,5rem)] py-10 text-slate-950">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
        aria-label="Go back"
      >
        Back
      </button>

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Welcome back
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black leading-tight tracking-tight text-slate-950">
            Sign in and keep your feedback moving.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Manage polls, review live responses, and publish results from one clean workspace.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/8 sm:p-9"
        >
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Pollify
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Log in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use your email and password to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-black text-slate-900">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
                className="min-h-12 rounded-lg border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-black text-slate-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={handleChange}
                className="min-h-12 rounded-lg border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-lg bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            Do not have an account?{" "}
            <Link
              to="/register"
              state={{ from: redirectPath }}
              className="font-black text-emerald-700 hover:text-emerald-800"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
