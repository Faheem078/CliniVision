"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError(
        "Please enter a valid hospital email address."
      );
      return;
    }

    setLoading(true);

    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 1500);
    });

    setLoading(false);
    setSuccess(true);
    setEmail("");
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070A10] px-4 font-sans text-slate-100 antialiased">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600/10 blur-[140px]" />

      {/* Secondary Glow */}
      <div className="pointer-events-none absolute right-[10%] top-[10%] h-64 w-64 rounded-full bg-cyan-400/5 blur-[120px]" />

      {/* Subtle Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.12]" />

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">
        {/* Top Header Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Image
              src="/logo.png"
              alt="CliniVision Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          <span className="text-xl font-medium tracking-tight text-white">
            CliniVision
          </span>
        </div>

        {/* Main Card */}
        <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0C101A]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Reset Password
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Enter your hospital-registered email to
              <br />
              receive a recovery link.
            </p>
          </div>

          {success ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                Recovery link sent to your email. Check your inbox.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 space-y-4"
            >
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-[#06080F] px-3.5 transition ${
                    error
                      ? "border-red-500/50 focus-within:border-red-400"
                      : "border-slate-800 focus-within:border-sky-500/50"
                  }`}
                >
                  <Mail
                    size={16}
                    className={
                      error
                        ? "text-red-400"
                        : "text-slate-500"
                    }
                  />

                  <input
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="dr.smith@hospital.org"
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error ? "email-error" : undefined
                    }
                    className="h-11 w-full bg-transparent px-3 text-xs text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {error && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-left text-[11px] text-red-400"
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-400 text-xs font-medium text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:bg-sky-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Recovery Link</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 border-t border-slate-800/60 pt-5 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 space-y-1 text-center text-[11px] text-slate-600">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="cursor-pointer transition hover:text-slate-400"
            >
              IT Support
            </button>

            <span>•</span>

            <button
              type="button"
              className="cursor-pointer transition hover:text-slate-400"
            >
              System Status
            </button>
          </div>

          <div>CliniVision Secure Gateway v3.4.1</div>
        </footer>
      </div>
    </main>
  );
}