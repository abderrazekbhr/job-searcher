import React, { JSX, useEffect, useState } from "react";
// import { axiosConnection } from "../../utils/axiosConnection"; // décommente si nécessaire
import { Link, useNavigate } from "react-router";
import { routersObject } from "../../router/route";
import { Button } from "@/components/ui/button";

import { LoginForm } from "./types";
import axiosInstance from "@/config/axios";
import { useForm, SubmitHandler } from "react-hook-form";

export default function Login(): JSX.Element {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.getItem("token") && navigate("/dashboard");
  }, []);

  const login: SubmitHandler<LoginForm> = async (data) => {
    axiosInstance
      .post("users/log-in/", {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        navigate("/dashboard");
        console.log("Login successful:", response.data);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-800">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-8 dark:bg-slate-900/80 dark:border-slate-700">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-100">
            Sign in to continue to your account
          </p>
        </header>
        <form
          onSubmit={handleSubmit(login)}
          className="space-y-4"
          aria-describedby="form-error"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-100"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
              aria-describedby={error ? "form-error" : undefined}
              {...register("email")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-100"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div
              id="form-error"
              className="text-sm text-red-600"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="p-3 rounded-md bg-green-50 text-green-700 text-sm"
              aria-live="polite"
            >
              Logged in successfully 🎉
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-sky-600   px-6 font-medium text-neutral-200 transition hover:scale-110 dark:text-sky-400 dark:text-slate-900"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <>
                  <span>Sign in</span>
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20 dark:bg-gray/20"></div>
                  </div>
                </>
              )}
            </Button>
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
