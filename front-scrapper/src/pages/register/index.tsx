import React, { JSX, useState } from "react";

// RegisterPage.tsx
// React + TypeScript single-file registration page using Tailwind CSS
// Fields: email, first_name, last_name, password, confirm password
// Includes client-side validation, password strength meter, and accessibility hints

type RegisterForm = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage(): JSX.Element {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof RegisterForm, string>> = {};

    if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";

    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    // optional: require a number and a letter
    if (!/[A-Z]/.test(form.password)) newErrors.password = (newErrors.password ? newErrors.password + " " : "") + "Include at least one uppercase letter.";
    if (!/[0-9]/.test(form.password)) newErrors.password = (newErrors.password ? newErrors.password + " " : "") + "Include at least one number.";

    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function passwordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score; // 0..4
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await fakeRegisterRequest({
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
      });
      setSuccess("Registration successful — check your email to verify your account.");
      setForm({ email: "", first_name: "", last_name: "", password: "", confirmPassword: "" });
    } catch (err) {
      setErrors({ email: "Registration failed — try again later." });
    } finally {
      setSubmitting(false);
    }
  }

  const strength = passwordStrength(form.password);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Create an account</h2>
        <p className="text-sm text-slate-500 mb-6">Start your journey — enter your details below.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.first_name ? "border-red-300" : "border-slate-200"}`}
                placeholder="Jane"
                aria-invalid={!!errors.first_name}
              />
              {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.last_name ? "border-red-300" : "border-slate-200"}`}
                placeholder="Doe"
                aria-invalid={!!errors.last_name}
              />
              {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? "border-red-300" : "border-slate-200"}`}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? "border-red-300" : "border-slate-200"}`}
              placeholder="Create a strong password"
              aria-describedby="password-strength"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="w-2/3">
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${(strength / 4) * 100}%` }}
                    className={`h-full transition-all duration-300 ${strength <= 1 ? "bg-red-400" : strength === 2 ? "bg-amber-400" : strength === 3 ? "bg-yellow-400" : "bg-green-500"}`}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500" id="password-strength">
                {strengthLabel}
              </div>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.confirmPassword ? "border-red-300" : "border-slate-200"}`}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {success && <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">{success}</div>}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium shadow hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          By creating an account you agree to our <a className="underline text-indigo-600">Terms</a>.
        </p>
      </div>
    </div>
  );
}

// -------------------- helpers --------------------

function fakeRegisterRequest(_payload: { email: string; first_name: string; last_name: string; password: string }) {
  // Replace with real API call / service. This simulates latency and success.
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 900);
  });
}
