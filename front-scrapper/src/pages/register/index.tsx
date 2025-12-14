import { useState } from "react";
import { RegisterForm } from "./types";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "@/config/axios";
import { Link, useNavigate } from "react-router";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const [strength, setStrength] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Watch password field for real-time validation
  const password = watch("password", "");

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    setStrength(score);
  };

  const signup: SubmitHandler<RegisterForm> = async (data) => {
    setSuccess(null);
    setApiError(null);
    setSubmitting(true);
    console.log(data);

    try {
      const response = await axiosInstance.post("users/sign-up/", {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      });

      setSuccess("Account created successfully! Redirecting...");
      reset(); // Clear form
      setStrength(0);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.email?.[0] ||
        "Registration failed — try again later.";
      setApiError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
    strength
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Start your journey — enter your details below.
        </p>

        <form onSubmit={handleSubmit(signup)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-slate-700"
              >
                First name
              </label>
              <input
                id="first_name"
                {...register("first_name", {
                  required: "First name is required",
                })}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.first_name ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Jane"
                aria-invalid={!!errors.first_name}
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <input
                id="last_name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.last_name ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Doe"
                aria-invalid={!!errors.last_name}
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.email ? "border-red-300" : "border-slate-200"
              }`}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
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
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                onChange: (e) => passwordStrength(e.target.value),
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.password ? "border-red-300" : "border-slate-200"
              }`}
              placeholder="Create a strong password"
              aria-describedby="password-strength"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="w-2/3">
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${(strength / 4) * 100}%` }}
                    className={`h-full transition-all duration-300 ${
                      strength <= 1
                        ? "bg-red-400"
                        : strength === 2
                        ? "bg-amber-400"
                        : strength === 3
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500" id="password-strength">
                {strengthLabel}
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.confirmPassword ? "border-red-300" : "border-slate-200"
              }`}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {apiError && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {apiError}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 text-white px-4 py-2 font-medium shadow hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
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
                  Creating...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline text-sky-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
