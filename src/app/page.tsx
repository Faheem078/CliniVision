"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Database,
  FileCheck2,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  Network,
  PlayCircle,
  Plus,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";

type ContactFormData = {
  name: string;
  hospital: string;
  email: string;
  message: string;
};

type LegalModal = "privacy" | "terms" | null;

export default function LandingPage() {
  const [contactForm, setContactForm] =
    useState<ContactFormData>({
      name: "",
      hospital: "",
      email: "",
      message: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitSuccess, setSubmitSuccess] =
    useState(false);

  const [activeModal, setActiveModal] =
    useState<LegalModal>(null);

  useEffect(() => {
    if (!activeModal) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [activeModal]);

  const handleContactChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setContactForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleContactSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      setContactForm({
        name: "",
        hospital: "",
        email: "",
        message: "",
      });
    }, 900);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06090E] font-sans text-slate-300 selection:bg-[#5EEAD4] selection:text-black">
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      {/* Background Glow */}
      <div className="pointer-events-none fixed right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="pointer-events-none fixed bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/5 blur-[150px]" />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06090E]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="#home"
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo.png"
              alt="CliniVision Logo"
              className="h-8 w-8 object-contain"
            />

            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none tracking-tight text-white">
                Clini
                <span className="text-[#7DD3FC]">
                  Vision
                </span>
              </span>

              <span className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-slate-500">
                Clinical AI
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-400 md:flex">
            <Link
              href="#home"
              className="transition-colors hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="#solutions"
              className="transition-colors hover:text-cyan-300"
            >
              Solutions
            </Link>

            <Link
              href="#about"
              className="transition-colors hover:text-cyan-300"
            >
              About
            </Link>

            <Link
              href="#contact"
              className="transition-colors hover:text-cyan-300"
            >
              Contact
            </Link>
          </nav>

          <Link
            href="/signup"
            className="rounded-lg bg-[#7DD3FC] px-4 py-2 text-xs font-semibold text-black shadow-[0_0_15px_rgba(125,211,252,0.4)] transition-all hover:bg-[#38BDF8]"
          >
            Enter App
          </Link>
        </div>
      </header>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          id="home"
          className="relative z-10 mx-auto grid max-w-7xl scroll-mt-20 grid-cols-1 items-center gap-10 px-6 pb-20 pt-14 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              SYSTEM ONLINE V2.4.1
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              The Future of
              <br />

              <span className="bg-gradient-to-r from-[#7DD3FC] via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Radiology,
              </span>

              <br />
              Powered by AI.
            </h1>

            <p className="max-w-lg text-xs leading-relaxed text-slate-400 sm:text-sm">
              High-precision diagnostic analytics for
              clinical excellence. CliniVision integrates
              seamlessly into existing DICOM workflows,
              analyzing complex multi-modal scans in
              real-time to surface clinically significant
              findings quickly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#contact"
                className="flex items-center gap-2 rounded-lg bg-[#7DD3FC] px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_20px_rgba(125,211,252,0.3)] transition-all hover:bg-[#38BDF8]"
              >
                Book a Demo
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#solutions"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0F172A]/80 px-5 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-white/20 hover:text-white"
              >
                View Product
                <PlayCircle size={14} />
              </Link>
            </div>
          </div>

          {/* Diagnostic Analysis Card */}
          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0B101B] p-4 shadow-2xl backdrop-blur-xl">
              {/* Analysis Status */}
              <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#05080E] p-3 text-xs">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    ANALYSIS STATUS
                  </div>

                  <div className="my-1.5 h-1.5 w-48 overflow-hidden rounded-full bg-emerald-950">
                    <div className="h-full w-full rounded-full bg-emerald-400" />
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Processing Time:{" "}
                    <span className="font-mono font-bold text-white">
                      1.2s
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <Check
                    size={16}
                    className="ml-auto mb-1 text-emerald-400"
                  />

                  <span className="text-[10px] font-mono text-emerald-400">
                    100% Complete
                  </span>
                </div>
              </div>

              {/* MRI Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-cyan-500/20 bg-[#04060A]">
                <img
                  src="/brain.png"
                  alt="Brain Scan MRI"
                  className="h-full w-full rounded-xl object-cover"
                />

                {/* Image Tint */}
                <div className="pointer-events-none absolute inset-0 bg-cyan-950/10" />

                {/* Grid Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px] opacity-10" />

                {/* Scan Lines */}
                <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-cyan-300/20" />
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-cyan-300/20" />

                {/* Rotating Reticle */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-cyan-300/30 shadow-[0_0_35px_rgba(34,211,238,0.15)]">
                    <div className="absolute h-full w-full animate-spin rounded-full border border-dashed border-cyan-300/60 [animation-duration:8s]" />

                    <div className="absolute h-32 w-32 rounded-full border border-cyan-300/30" />

                    <div className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,1)]" />

                    <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-cyan-300/80" />
                    <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-cyan-300/80" />
                    <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-cyan-300/80" />
                    <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-cyan-300/80" />
                  </div>
                </div>

                {/* Scan Label */}
                <div className="absolute left-3 top-3 rounded-lg border border-cyan-400/20 bg-[#07101A]/85 px-3 py-2 backdrop-blur-md">
                  <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-slate-500">
                    MRI SERIES
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold text-cyan-300">
                    AXIAL T2 / FRAME 24
                  </p>
                </div>

                {/* Anomaly Badge */}
                <div className="absolute bottom-3 right-3 flex max-w-[205px] items-start gap-2 rounded-lg border border-red-500/40 bg-[#0B101B]/95 p-2.5 shadow-xl backdrop-blur-md">
                  <AlertTriangle
                    size={14}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <div>
                    <div className="text-[10px] font-semibold text-white">
                      Anomaly Detected
                    </div>

                    <div className="text-[9px] text-slate-400">
                      Confidence:{" "}
                      <span className="font-bold text-red-300">
                        99.4%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST BAR
        ====================================================== */}

        <section className="relative z-10 border-y border-white/5 bg-[#05080E] py-8">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Built for modern clinical environments
            </p>

            <div className="grid grid-cols-2 items-center justify-center gap-8 opacity-80 md:grid-cols-4">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <Shield
                  size={16}
                  className="text-cyan-400"
                />
                Enterprise Security
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <Clock
                  size={16}
                  className="text-cyan-400"
                />
                Real-Time Analysis
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <Plus
                  size={16}
                  className="text-cyan-400"
                />
                Clinical Workflow
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <Lock
                  size={16}
                  className="text-cyan-400"
                />
                Privacy Focused
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SOLUTIONS
        ====================================================== */}

        <section
          id="solutions"
          className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-6 py-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[#7DD3FC]">
                — Solutions
              </div>

              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white">
                Intelligence built directly into the
                radiology workflow.
              </h2>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              Assist clinical teams with intelligent
              detection, interoperability and structured
              reporting without disrupting established
              workflows.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Solution 1 */}
            <div className="group rounded-2xl border border-white/10 bg-[#0A0F19]/90 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <BrainCircuit size={20} />
              </div>

              <h3 className="text-lg font-bold text-white">
                AI Anomaly Detection
              </h3>

              <p className="mt-3 text-xs leading-6 text-slate-400">
                Analyze CT, MRI and other imaging studies
                for suspicious findings and surface
                regions of interest for clinician review.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#05080E] p-4">
                <div className="mb-3 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">
                    Detection Confidence
                  </span>

                  <span className="font-bold text-emerald-400">
                    99.4%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
                  <div className="h-full w-[99%] rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="group rounded-2xl border border-white/10 bg-[#0A0F19]/90 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Network size={20} />
              </div>

              <h3 className="text-lg font-bold text-white">
                DICOM / PACS Integration
              </h3>

              <p className="mt-3 text-xs leading-6 text-slate-400">
                Connect CliniVision with existing imaging
                infrastructure through standard DICOM and
                PACS-oriented workflows.
              </p>

              <div className="mt-6 flex items-center rounded-xl border border-white/10 bg-[#05080E] p-4">
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 font-mono text-[9px] text-slate-400">
                  MODALITY
                </div>

                <div className="mx-2 h-px flex-1 bg-cyan-400/30" />

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
                  <Share2 size={14} />
                </div>

                <div className="mx-2 h-px flex-1 bg-cyan-400/30" />

                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 font-mono text-[9px] text-slate-400">
                  PACS
                </div>
              </div>
            </div>

            {/* Solution 3 */}
            <div className="group rounded-2xl border border-white/10 bg-[#0A0F19]/90 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <FileCheck2 size={20} />
              </div>

              <h3 className="text-lg font-bold text-white">
                Automated Draft Reporting
              </h3>

              <p className="mt-3 text-xs leading-6 text-slate-400">
                Convert AI-assisted findings into
                structured preliminary reports that
                radiologists can review, edit and approve.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#05080E] p-4 font-mono text-[9px]">
                <p className="font-bold text-emerald-400">
                  FINDINGS
                </p>

                <p className="mt-2 text-slate-500">
                  No acute hemorrhage identified.
                </p>

                <p className="mt-1 rounded border border-cyan-500/20 bg-cyan-500/5 p-2 text-cyan-300">
                  AI draft prepared for clinician review.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Clinical Feature Cards */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-white/10 bg-[#0A0F19] p-6 sm:p-8 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <Search size={18} />
                </div>

                <span className="font-mono text-xs text-slate-600">
                  04
                </span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Intelligent Triage
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Prioritize studies that may contain
                    urgent or high-risk findings, helping
                    teams focus attention where it matters
                    most.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#05080E] p-4">
                  <div className="mb-4 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">
                      Worklist Priority
                    </span>

                    <span className="text-red-400">
                      HIGH
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-red-400/80" />
                    <div className="h-2 w-4/5 rounded-full bg-cyan-400/50" />
                    <div className="h-2 w-3/5 rounded-full bg-slate-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0A0F19] p-6 sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <FileText size={18} />
                </div>

                <span className="font-mono text-xs text-slate-600">
                  05
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-white">
                Structured Clinical Output
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Maintain consistent terminology and
                structured reporting patterns across
                imaging workflows.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}

        <section
          id="about"
          className="relative z-10 scroll-mt-20 border-y border-white/5 bg-[#080C14]/80 py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[#7DD3FC]">
                — About CliniVision
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Clinical intelligence designed to support,
                not replace, medical expertise.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
                CliniVision is designed as a clinical decision
                support platform for radiology teams. The
                goal is to help clinicians prioritize
                studies, identify potential abnormalities
                and create more efficient reporting
                workflows while keeping qualified
                healthcare professionals in control of
                final clinical decisions.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-xs font-bold text-white">
                      Clinician-first workflow
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      AI output remains reviewable,
                      editable and subject to professional
                      clinical judgment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-xs font-bold text-white">
                      Secure architecture
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Designed around healthcare privacy,
                      controlled access and secure data
                      handling principles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-xs font-bold text-white">
                      Interoperability focused
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Designed to integrate alongside
                      established radiology infrastructure
                      and standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6">
                <BrainCircuit className="mb-5 h-5 w-5 text-cyan-400" />

                <p className="text-3xl font-black text-white">
                  99.4%
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Example AI Confidence
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6">
                <Clock className="mb-5 h-5 w-5 text-cyan-400" />

                <p className="text-3xl font-black text-white">
                  1.2s
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Example Processing Time
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6">
                <Database className="mb-5 h-5 w-5 text-cyan-400" />

                <p className="text-3xl font-black text-white">
                  DICOM
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Workflow Compatible
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B101B] p-6">
                <ShieldCheck className="mb-5 h-5 w-5 text-emerald-400" />

                <p className="text-3xl font-black text-white">
                  Secure
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Privacy Focused
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-7xl px-6">
            <div className="rounded-2xl border border-white/10 bg-[#05080E]/80 p-6">
              <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Designed for healthcare organizations
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  "Academic Hospitals",
                  "Radiology Groups",
                  "Imaging Centers",
                  "Clinical Networks",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-4"
                  >
                    <Building2 className="h-4 w-4 text-cyan-400" />

                    <span className="text-[10px] font-semibold text-slate-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}

        <section
          id="contact"
          className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-6 py-24"
        >
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[#7DD3FC]">
                — Contact
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Bring CliniVision into your clinical workflow.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Contact our team to discuss clinical
                requirements, workflow integration, product
                demonstrations or enterprise deployment.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0A0F19] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Mail size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-white">
                      Product Inquiry
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Request a demonstration or technical
                      discussion.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0A0F19] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Building2 size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-white">
                      Enterprise Deployment
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Discuss hospital, network and
                      integration requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Name
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(event) =>
                          handleContactChange(
                            "name",
                            event.target.value
                          )
                        }
                        placeholder="Dr. Jane Doe"
                        className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-hospital"
                      className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Hospital / Clinic
                    </label>

                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="contact-hospital"
                        type="text"
                        required
                        value={contactForm.hospital}
                        onChange={(event) =>
                          handleContactChange(
                            "hospital",
                            event.target.value
                          )
                        }
                        placeholder="Medical Center"
                        className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Professional Email
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(event) =>
                          handleContactChange(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="name@hospital.com"
                        className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-slate-400"
                    >
                      Message
                    </label>

                    <div className="relative">
                      <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-500" />

                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(event) =>
                          handleContactChange(
                            "message",
                            event.target.value
                          )
                        }
                        placeholder="Tell us about your clinical workflow or integration requirements..."
                        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </div>

                {submitSuccess && (
                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />

                    <p className="text-xs text-emerald-300">
                      Thank you. Your inquiry has been
                      submitted successfully.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="relative z-10 px-6 pb-24">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-[#0B101B] to-blue-500/5 p-8 text-center shadow-[0_30px_100px_rgba(34,211,238,0.08)] sm:p-12">
            <Sparkles className="mx-auto h-6 w-6 text-cyan-400" />

            <h2 className="mt-4 text-3xl font-bold text-white">
              Ready to explore CliniVision?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Enter the clinical platform or request a
              product demonstration for your organization.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
              >
                Enter App
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#070A11] px-6 py-3 text-xs font-bold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-white/5 bg-[#04060A] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <Link
              href="#home"
              className="flex items-center gap-2.5"
            >
              <img
                src="/logo.png"
                alt="CliniVision Logo"
                className="h-8 w-8 object-contain"
              />

              <div>
                <p className="text-sm font-bold text-white">
                  Clini
                  <span className="text-cyan-300">
                    Vision
                  </span>
                </p>

                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  Medical Systems
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-slate-500">
              <Link
                href="#home"
                className="transition-colors hover:text-cyan-300"
              >
                Home
              </Link>

              <Link
                href="#solutions"
                className="transition-colors hover:text-cyan-300"
              >
                Solutions
              </Link>

              <Link
                href="#about"
                className="transition-colors hover:text-cyan-300"
              >
                About
              </Link>

              <button
                type="button"
                onClick={() =>
                  setActiveModal("privacy")
                }
                className="transition-colors hover:text-cyan-300"
              >
                Privacy
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModal("terms")
                }
                className="transition-colors hover:text-cyan-300"
              >
                Terms
              </button>

              <Link
                href="#contact"
                className="transition-colors hover:text-cyan-300"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/5 pt-6 text-[9px] text-slate-600 sm:flex-row">
            <p>
              © {new Date().getFullYear()} CliniVision Medical
              Systems. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />

              <span>
                Secure clinical platform architecture
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================
          PRIVACY MODAL
      ====================================================== */}

      {activeModal === "privacy" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0B121E]/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">
                    CliniVision Medical Systems
                  </p>

                  <h2
                    id="privacy-title"
                    className="text-base font-bold text-white"
                  >
                    Privacy Policy
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close privacy policy"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(85vh-70px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
              <div>
                <h3 className="text-sm font-bold text-white">
                  1. Data Protection
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  CliniVision is designed around privacy,
                  security and controlled access
                  principles appropriate for clinical
                  environments. Production implementations
                  should collect and process only data
                  necessary for the intended workflow.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  2. Protected Health Information
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Where protected health information is
                  processed, organizations should
                  configure appropriate administrative,
                  physical and technical safeguards,
                  access controls, audit processes and
                  contractual protections.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  3. HIPAA-Oriented Safeguards
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Deployments intended for regulated
                  healthcare environments should implement
                  safeguards appropriate to applicable
                  HIPAA requirements, including access
                  control, authentication, auditing and
                  secure transmission.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  4. GDPR Principles
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Where GDPR applies, organizations should
                  support lawful processing, transparency,
                  purpose limitation, data minimization,
                  appropriate retention, security and
                  applicable data-subject rights.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  5. Account and Access Data
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Authentication details and account
                  information should be handled only for
                  secure access, account administration
                  and related platform functions.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
                <p className="text-[10px] leading-5 text-amber-200/80">
                  This prototype policy is product
                  interface copy and should be reviewed by
                  qualified legal and compliance
                  professionals before a production
                  healthcare deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TERMS MODAL
      ====================================================== */}

      {activeModal === "terms" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0B121E]/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <FileCheck2 size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-violet-400">
                    CliniVision Medical Systems
                  </p>

                  <h2
                    id="terms-title"
                    className="text-base font-bold text-white"
                  >
                    Terms of Service
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close terms of service"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(85vh-70px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
              <div>
                <h3 className="text-sm font-bold text-white">
                  1. Clinical Decision Support
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  CliniVision is intended to support qualified
                  healthcare professionals. AI-generated
                  findings, alerts and draft reports must
                  be reviewed using appropriate clinical
                  judgment before patient-care decisions
                  are made.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  2. Authorized Use
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Users must access CliniVision only within
                  their authorized professional role and
                  must protect passwords, authentication
                  credentials and clinical information
                  from unauthorized access.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  3. Organizational Responsibility
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Healthcare organizations remain
                  responsible for clinical governance,
                  user authorization, regulatory
                  compliance, retention requirements,
                  patient consent where applicable and
                  deployment configuration.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  4. AI Limitations
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Artificial intelligence systems can
                  produce incomplete, incorrect or
                  uncertain results. Platform output
                  should not be treated as an independent
                  diagnosis or substitute for professional
                  medical review.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  5. Availability
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Production availability, support,
                  service levels, warranties, liability
                  and commercial obligations should be
                  governed by the applicable customer
                  agreement.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
                <p className="text-[10px] leading-5 text-amber-200/80">
                  These prototype terms should be reviewed
                  by qualified legal and regulatory
                  professionals before use in a production
                  medical product.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smooth Scrolling */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}