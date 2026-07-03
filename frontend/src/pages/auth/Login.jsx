import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-slate mb-2">
        Welcome back
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Sign in to your workspace
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@company.com"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-indigo focus:border-indigo transition"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-indigo focus:border-indigo transition"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-dark transition disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-slate text-center mt-8">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;