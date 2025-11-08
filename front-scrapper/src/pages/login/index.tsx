import React, { JSX, useEffect, useRef, useState } from "react";
import { FormState } from "./types";
import { captchaUtils } from "./helper";
import { axiosConnection } from "../../utils/axiosConnection";
import { Link } from "react-router";
import { routersObject } from "../../router/route";
export default function Login() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    captchaInput: "",
  });

  const [captcha, setCaptcha] = useState<string>(
    captchaUtils.generateCaptchaText(6)
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    captchaUtils.drawCaptchaToCanvas(captcha, canvasRef.current);
  }, [captcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshCaptcha = () => {
    setCaptcha(captchaUtils.generateCaptchaText(6));
    setForm((prev) => ({ ...prev, captchaInput: "" }));
    setError(null);
  };

  const validateEmail = (email: string) => {
    // simple email regex (sufficient for client-side validation)
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const validatePassword = (password: string) => {
    // require at least 8 chars — adapt as needed
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // client validations
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(form.password)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.captchaInput.trim().toLowerCase() !== captcha.toLowerCase()) {
      setError("CAPTCHA doesn't match. Please try again.");
      refreshCaptcha();
      return;
    }

    // simulate async login
    setLoading(true);
    try {
      await captchaUtils.fakeNetworkRequest({
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setError(null);
      // optionally reset form
      setForm({ email: "", password: "", captchaInput: "" });
      setCaptcha(captchaUtils.generateCaptchaText(6));
    } catch (err) {
      setError("Login failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    axiosConnection.post();
  };

  return (
    <div className="h-screen w-full bg-gradient-to-tr from-slate-50 to-sky-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to continue to your account
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-describedby="form-error"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
              aria-invalid={error?.includes("email") ?? false}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700">
              Prove you're human
            </label>
            <div className="mt-2 flex items-center gap-3">
              <canvas
                ref={canvasRef}
                width={180}
                height={60}
                className="rounded-md border border-slate-200 shadow-sm"
                role="img"
                aria-label="CAPTCHA image"
              />

              <div className="flex-1">
                <input
                  name="captchaInput"
                  value={form.captchaInput}
                  onChange={handleChange}
                  placeholder="Type the characters you see"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  aria-label="Enter CAPTCHA text"
                  required
                />

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200"
                  >
                    Refresh CAPTCHA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div id="form-error" className="text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
              Logged in successfully 🎉
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 text-white px-4 py-2 font-medium shadow hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <footer className="mt-6 text-center text-sm text-slate-500">
          <p>
            New here?{" "}
            <Link
              to={routersObject.register}
              className="text-sky-600 underline"
            >
              Create an account
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
