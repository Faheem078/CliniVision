"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Building,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Redirect to main dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#06090E] p-6 font-sans text-slate-200 selection:bg-[#7DD3FC] selection:text-black">
      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Back Link */}
      <div className="absolute left-6 top-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Landing Page
        </Link>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0B101B]/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          {/* CliniVision Logo */}
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center">
            {/* Logo Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/5 shadow-[0_0_22px_rgba(56,189,248,0.18)]">
              <Image
                src="/logo.png"
                alt="CliniVision Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>

          <span className="text-base font-bold tracking-tight text-white">
            Clini
            <span className="text-[#7DD3FC]">Vision</span>
          </span>

          <span className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-slate-500">
            CLINICAL AI
          </span>

          <h1 className="mt-4 text-xl font-bold text-white">
            {isSignUp
              ? "Create Professional Account"
              : "Welcome Back"}
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Access AI-powered clinical radiology diagnostics
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/5 bg-[#05080E] p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`rounded-lg py-2 transition-all ${
              isSignUp
                ? "bg-[#7DD3FC] text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`rounded-lg py-2 transition-all ${
              !isSignUp
                ? "bg-[#7DD3FC] text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {isSignUp && (
            <>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />

                  <input
                    id="full-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Dr. Jane Doe"
                    className="w-full rounded-xl border border-white/10 bg-[#05080E] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#7DD3FC]"
                  />
                </div>
              </div>

              {/* Hospital */}
              <div>
                <label
                  htmlFor="hospital"
                  className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                >
                  Hospital / Institution
                </label>

                <div className="relative">
                  <Building
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />

                  <input
                    id="hospital"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Memorial Medical Center"
                    className="w-full rounded-xl border border-white/10 bg-[#05080E] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#7DD3FC]"
                  />
                </div>
              </div>

              {/* Medical License */}
              <div>
                <label
                  htmlFor="medical-license"
                  className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                >
                  Medical License No.
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />

                  <input
                    id="medical-license"
                    type="text"
                    required
                    placeholder="MED-12345-678"
                    className="w-full rounded-xl border border-white/10 bg-[#05080E] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#7DD3FC]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="professional-email"
              className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
            >
              Professional Email
            </label>

            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-3 text-slate-500"
              />

              <input
                id="professional-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@hospital.com"
                className="w-full rounded-xl border border-white/10 bg-[#05080E] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#7DD3FC]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-[10px] font-mono uppercase tracking-wider text-slate-400"
              >
                Password
              </label>

              {!isSignUp && (
                <Link
                  href="/reset-password"
                  className="text-[10px] font-medium text-[#7DD3FC] transition-colors hover:text-cyan-300 hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>

            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-3 text-slate-500"
              />

              <input
                id="password"
                type="password"
                required
                autoComplete={
                  isSignUp
                    ? "new-password"
                    : "current-password"
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#05080E] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#7DD3FC]"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#7DD3FC] py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(125,211,252,0.3)] transition-all hover:bg-[#38BDF8]"
          >
            {isSignUp
              ? "Create Account"
              : "Sign In to Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}