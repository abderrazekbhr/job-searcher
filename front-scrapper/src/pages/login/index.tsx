import React, { JSX, useEffect, useRef, useState } from "react";
import { FormState } from "./types";
import { captchaUtils } from "./helper";
// import { axiosConnection } from "../../utils/axiosConnection"; // décommente si nécessaire
import { Link } from "react-router";
import { routersObject } from "../../router/route";
import { Button } from "@/components/ui/button";

export default function Login(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    captchaInput: "",
  });

  const [captcha, setCaptcha] = useState<string>(() =>
    captchaUtils.generateCaptchaText(6)
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // dessine le captcha si le canvas est prêt
    if (canvasRef.current) {
      captchaUtils.drawCaptchaToCanvas(captcha, canvasRef.current);
    }
  }, [captcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear error as user types
    setError(null);
  };

  const refreshCaptcha = () => {
    setCaptcha(captchaUtils.generateCaptchaText(6));
    setForm((prev) => ({ ...prev, captchaInput: "" }));
    setError(null);
  };

  const validateEmail = (email: string) => {
    // regex simple mais robuste pour validation client
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // validations client
    if (!validateEmail(form.email)) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    if (!validatePassword(form.password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (form.captchaInput.trim().toLowerCase() !== captcha.toLowerCase()) {
      setError("Le CAPTCHA ne correspond pas. Veuillez réessayer.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      // Remplacez par votre appel réel (axiosConnection) si nécessaire
      await captchaUtils.fakeNetworkRequest({
        email: form.email,
        password: form.password,
      });

      setSuccess(true);
      setError(null);
      setForm({ email: "", password: "", captchaInput: "" });
      setCaptcha(captchaUtils.generateCaptchaText(6));
    } catch (err) {
      setError("Échec de connexion — veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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
          onSubmit={handleSubmit}
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
              name="email"
              type="email"
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
              aria-invalid={!validateEmail(form.email) && form.email.length > 0}
              aria-describedby={error ? "form-error" : undefined}
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
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your password"
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
              Prove you're human
            </label>
            <div className="mt-2 flex items-center gap-3">
              <canvas
                ref={canvasRef}
                width={180}
                height={60}
                className="rounded-md border border-slate-200 shadow-sm dark:border-slate-700"
                role="img"
                aria-label="CAPTCHA image"
              />

              <div className="flex-1">
                <input
                  name="captchaInput"
                  onChange={handleChange}
                  placeholder="Type the characters you see"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  aria-label="Enter CAPTCHA text"
                  required
                />

                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={refreshCaptcha}
                    className="text-sm px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200"
                  >
                    Refresh CAPTCHA
                  </Button>
                </div>
              </div>
            </div>
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
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950  px-6 font-medium text-neutral-200 transition hover:scale-110 dark:bg-slate-100 dark:text-slate-900"
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
