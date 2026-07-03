import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_OPTIONS } from "../../enums/userRoles";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "HR",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-slate mb-2">
        Get started
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Create your workspace account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-indigo focus:border-indigo transition"
          />
        </div>

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

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1.5">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-indigo focus:border-indigo transition"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-dark transition disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-slate text-center mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;