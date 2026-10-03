"use client";

import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  Pencil,
  Save,
  Shield,
  Sliders,
  User,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

type SettingsTab =
  | "clinical"
  | "security"
  | "ai"
  | "integration"
  | "alerts";

type AlertPriority =
  | "Critical Priority"
  | "Standard Alert"
  | "High Priority";

interface AlertItem {
  id: string;
  title: string;
  priority: AlertPriority;
  dotClass: string;
  badgeClass: string;
}

const TABS: {
  id: SettingsTab;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "clinical",
    label: "Clinical Profile",
    description: "Provider identity and affiliation",
    icon: User,
  },
  {
    id: "security",
    label: "Account Security",
    description: "Authentication and access",
    icon: Shield,
  },
  {
    id: "ai",
    label: "AI Preferences",
    description: "Diagnostic model configuration",
    icon: Cpu,
  },
  {
    id: "integration",
    label: "Integration (PACS)",
    description: "Hospital system connectivity",
    icon: Layers,
  },
  {
    id: "alerts",
    label: "Display & Alerts",
    description: "Notifications and interface",
    icon: Sliders,
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "hemorrhage",
    title: "Hemorrhage / Stroke",
    priority: "Critical Priority",
    dotClass: "bg-red-400",
    badgeClass: "bg-[#070A11] text-slate-200",
  },
  {
    id: "fracture",
    title: "Fracture Detection",
    priority: "Standard Alert",
    dotClass: "bg-emerald-400",
    badgeClass: "bg-[#070A11] text-slate-200",
  },
  {
    id: "nodules",
    title: "Pulmonary Nodules",
    priority: "High Priority",
    dotClass: "bg-violet-300",
    badgeClass: "bg-[#070A11] text-slate-200",
  },
];

export default function SettingsPage() {
  const {
    fullName: contextFullName,
    role: contextRole,
    email: contextEmail,
    medicalLicense: contextMedicalLicense,
    primaryAffiliation: contextPrimaryAffiliation,
    avatarUrl: contextAvatarUrl,
    updateProfile,
  } = useProfile();

  const [activeTab, setActiveTab] =
    useState<SettingsTab>("clinical");

  const [fullName, setFullName] =
    useState(contextFullName);

  const [role, setRole] =
    useState(contextRole);

  const [email, setEmail] =
    useState(contextEmail);

  const [medicalLicense, setMedicalLicense] =
    useState(contextMedicalLicense);

  const [
    primaryAffiliation,
    setPrimaryAffiliation,
  ] = useState(contextPrimaryAffiliation);

  const [avatarUrl, setAvatarUrl] =
    useState<string | undefined>(
      contextAvatarUrl
    );

  const [sensitivity, setSensitivity] =
    useState(85);

  const [
    autoGenerateReports,
    setAutoGenerateReports,
  ] = useState(true);

  const [alerts, setAlerts] =
    useState<AlertItem[]>(INITIAL_ALERTS);

  const [twoFactor, setTwoFactor] =
    useState(true);

  const [sessionTimeout, setSessionTimeout] =
    useState("30");

  const [pacsUrl, setPacsUrl] = useState(
    "https://pacs.clinivision.local"
  );

  const [pacsPort, setPacsPort] =
    useState("8042");

  const [aeTitle, setAeTitle] =
    useState("CLINIVISION_AE");

  const [hl7Enabled, setHl7Enabled] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [criticalAlerts, setCriticalAlerts] =
    useState(true);

  const [reportUpdates, setReportUpdates] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(true);

  const [toast, setToast] =
    useState<string | null>(null);

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  const [testingConnection, setTestingConnection] =
    useState(false);

  const avatarInputRef =
    useRef<HTMLInputElement | null>(null);

  const [avatarInputKey, setAvatarInputKey] =
    useState(0);

  useEffect(() => {
    setFullName(contextFullName);
    setRole(contextRole);
    setEmail(contextEmail);
    setMedicalLicense(contextMedicalLicense);
    setPrimaryAffiliation(
      contextPrimaryAffiliation
    );
    setAvatarUrl(contextAvatarUrl);
  }, [
    contextFullName,
    contextRole,
    contextEmail,
    contextMedicalLicense,
    contextPrimaryAffiliation,
    contextAvatarUrl,
  ]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast(message);
    setToastType(type);

    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const initials = useMemo(() => {
    const cleanName = fullName
      .replace(/^Dr\.?\s*/i, "")
      .trim();

    const words = cleanName
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return (
        words[0][0] +
        words[words.length - 1][0]
      ).toUpperCase();
    }

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return "UM";
  }, [fullName]);

  const handleSaveConfiguration = () => {
    if (!fullName.trim()) {
      showToast(
        "Full Name is required.",
        "error"
      );
      return;
    }

    if (!role.trim()) {
      showToast(
        "Title / Role is required.",
        "error"
      );
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      role: role.trim(),
      email: email.trim(),
      medicalLicense: medicalLicense.trim(),
      primaryAffiliation:
        primaryAffiliation.trim(),
      avatarUrl,
    });

    showToast(
      "Profile & Clinic Details Saved"
    );
  };

  const handleDiscard = () => {
    setFullName(contextFullName);
    setRole(contextRole);
    setEmail(contextEmail);
    setMedicalLicense(contextMedicalLicense);
    setPrimaryAffiliation(
      contextPrimaryAffiliation
    );
    setAvatarUrl(contextAvatarUrl);

    showToast("Changes discarded.");
  };

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast(
        "Please select a valid image.",
        "error"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(
        "Profile photo must be smaller than 5 MB.",
        "error"
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result === "string"
      ) {
        setAvatarUrl(reader.result);

        showToast(
          "Profile photo updated. Save Configuration to apply."
        );
      }
    };

    reader.readAsDataURL(file);

    setAvatarInputKey(
      (value) => value + 1
    );
  };

  const handleSaveAI = () => {
    showToast(
      "AI Diagnostic Configuration Saved"
    );
  };

  const handleSaveSecurity = () => {
    showToast(
      "Security Settings Saved"
    );
  };

  const handleSaveConnection = () => {
    showToast(
      "PACS Connection Settings Saved"
    );
  };

  const handleSaveAlerts = () => {
    showToast(
      "Display & Alert Preferences Saved"
    );
  };

  const handleTestConnection = async () => {
    if (testingConnection) {
      return;
    }

    setTestingConnection(true);

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1800);
    });

    setTestingConnection(false);

    showToast(
      "PACS Connection Test Successful"
    );
  };

  const cyclePriority = (alertId: string) => {
    const sequence: AlertPriority[] = [
      "Critical Priority",
      "High Priority",
      "Standard Alert",
    ];

    setAlerts((current) =>
      current.map((alert) => {
        if (alert.id !== alertId) {
          return alert;
        }

        const currentIndex =
          sequence.indexOf(alert.priority);

        const nextPriority =
          sequence[
            (currentIndex + 1) %
              sequence.length
          ];

        return {
          ...alert,
          priority: nextPriority,
        };
      })
    );
  };

  const getPriorityClasses = (
    priority: AlertPriority
  ) => {
    if (priority === "Critical Priority") {
      return {
        dot: "bg-red-400",
        badge:
          "bg-red-500/10 text-red-300 border border-red-400/10",
      };
    }

    if (priority === "High Priority") {
      return {
        dot: "bg-violet-300",
        badge:
          "bg-violet-500/10 text-violet-300 border border-violet-400/10",
      };
    }

    return {
      dot: "bg-emerald-400",
      badge:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-400/10",
    };
  };

  return (
    <main className="min-h-screen w-full bg-[#070A11] text-[#F8FAFC]">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[200] flex max-w-sm items-center gap-3 rounded-xl border border-slate-700 bg-[#0B121E] px-4 py-3 shadow-2xl shadow-black/50"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toastType === "success"
                ? "bg-emerald-500/10"
                : "bg-red-500/10"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <span className="text-sm font-bold text-red-400">
                !
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-200">
            {toast}
          </p>
        </div>
      )}

      <header className="border-b border-slate-800/80 bg-[#070A11]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
                <img
                  src="/logo.png"
                  alt="CliniVision"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    System Online
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Platform Settings
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400 sm:text-sm">
                  Manage your clinical profile,
                  AI diagnostic configurations,
                  and hospital system
                  integrations.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-700 bg-[#0B121E] px-6 py-2.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
              >
                Discard Changes
              </button>

              <button
                type="button"
                onClick={handleSaveConfiguration}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-none bg-[#38BDF8] px-7 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-300 active:scale-95"
              >
                <Save className="h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B121E] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl lg:sticky lg:top-6">
            <div className="px-3 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                System Configuration
              </p>
            </div>

            <nav
              aria-label="Settings navigation"
              className="space-y-1"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                      active
                        ? "border-cyan-400/70 bg-[#12374C] text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.04)]"
                        : "border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-cyan-400/10"
                          : "bg-[#070A11]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active
                            ? "text-cyan-300"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold">
                        {tab.label}
                      </p>

                      <p
                        className={`mt-0.5 truncate text-[8px] ${
                          active
                            ? "text-cyan-300/60"
                            : "text-slate-500"
                        }`}
                      >
                        {tab.description}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 rounded-xl border border-emerald-400/10 bg-[#070A11] p-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                  Protected Environment
                </span>
              </div>

              <p className="mt-2 text-[8px] leading-4 text-slate-500">
                Clinical configuration is
                protected and access-controlled.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {activeTab === "clinical" && (
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0B121E] shadow-2xl shadow-black/10">
                <div className="border-b border-slate-800/80 px-5 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                      <User className="h-4 w-4 text-cyan-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-100">
                        Clinical Profile
                      </h2>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Identity and professional
                        information displayed across
                        the clinical platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="flex flex-col gap-8 xl:flex-row">
                    <div className="flex shrink-0 flex-col items-center xl:w-36">
                      <div className="relative">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-700 bg-[#070A11] shadow-[0_0_30px_rgba(0,240,255,0.08)]">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={`${fullName} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-black tracking-tight text-cyan-300">
                              {initials}
                            </span>
                          )}
                        </div>

                        <input
                          key={avatarInputKey}
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={
                            handleAvatarChange
                          }
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            avatarInputRef.current?.click()
                          }
                          aria-label="Change profile photo"
                          className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-[#0B121E] text-slate-200 shadow-lg transition-all hover:border-cyan-400 hover:bg-cyan-500 hover:text-slate-950 active:scale-95"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Profile Photo
                      </p>

                      <p className="mt-1 text-center text-[8px] leading-4 text-slate-600">
                        JPG, PNG
                        <br />
                        Max 5 MB
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="grid gap-5 md:grid-cols-2">
                        <SettingsInput
                          label="FULL NAME"
                          value={fullName}
                          onChange={setFullName}
                          placeholder="Dr. Umer"
                        />

                        <SettingsInput
                          label="TITLE / ROLE"
                          value={role}
                          onChange={setRole}
                          placeholder="Head Radiologist"
                        />

                        <SettingsInput
                          label="EMAIL ADDRESS"
                          type="email"
                          value={email}
                          onChange={setEmail}
                          placeholder="doctor@hospital.com"
                        />

                        <div>
                          <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                            MEDICAL LICENSE NO.
                          </label>

                          <div className="relative">
                            <input
                              value={
                                medicalLicense
                              }
                              onChange={(event) =>
                                setMedicalLicense(
                                  event.target
                                    .value
                                )
                              }
                              className="h-12 w-full rounded-xl border border-slate-800 bg-[#070A11] px-4 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                            />

                            <div className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500/10">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <SettingsInput
                            label="PRIMARY AFFILIATION / CLINIC"
                            value={
                              primaryAffiliation
                            }
                            onChange={
                              setPrimaryAffiliation
                            }
                            placeholder="Hospital or clinic name"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#070A11] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                            Header Preview
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-cyan-400/20 bg-[#0B121E] text-[9px] font-black text-cyan-300">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                initials
                              )}
                            </div>

                            <div>
                              <p className="text-xs font-bold text-white">
                                {fullName ||
                                  "Dr. Umer"}
                              </p>

                              <p className="text-[9px] text-slate-500">
                                {role ||
                                  "Head Radiologist"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                            Profile Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0B121E] shadow-2xl shadow-black/10">
                <div className="border-b border-slate-800/80 px-5 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                      <Cpu className="h-4 w-4 text-cyan-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-100">
                        AI Diagnostic Preferences
                      </h2>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Configure detection sensitivity
                        and clinical alert behavior.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-xl border border-slate-800 bg-[#070A11] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-medium text-slate-100">
                          Global Detection
                          Sensitivity
                        </p>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                          Adjust the confidence
                          threshold required for
                          AI to flag anomalies.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-lg border border-cyan-400/20 bg-[#0B121E] px-3 py-2 font-mono text-xs font-bold text-cyan-300">
                        {sensitivity >= 80
                          ? "HIGH"
                          : sensitivity >= 55
                          ? "BALANCED"
                          : "CONSERVATIVE"}{" "}
                        (
                        {(
                          sensitivity / 100
                        ).toFixed(2)}
                        )
                      </span>
                    </div>

                    <div className="mt-8">
                      <input
                        aria-label="Global Detection Sensitivity"
                        type="range"
                        min={25}
                        max={100}
                        value={sensitivity}
                        onChange={(event) =>
                          setSensitivity(
                            Number(
                              event.target.value
                            )
                          )
                        }
                        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-cyan-500"
                        style={{
                          background: `linear-gradient(to right, #38BDF8 0%, #38BDF8 ${
                            ((sensitivity - 25) /
                              75) *
                            100
                          }%, #1e293b ${
                            ((sensitivity - 25) /
                              75) *
                            100
                          }%, #1e293b 100%)`,
                        }}
                      />

                      <div className="mt-3 grid grid-cols-3 text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-left text-slate-500">
                          Conservative
                        </span>

                        <span className="text-center text-slate-500">
                          Balanced
                        </span>

                        <span className="text-right text-slate-500">
                          Aggressive
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#0B121E] p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-100">
                            Auto-generate Draft
                            Reports
                          </p>

                          <p className="mt-1 text-[9px] leading-4 text-slate-500">
                            AI will automatically
                            pre-fill standard
                            reporting templates
                            based on initial scan
                            analysis.
                          </p>
                        </div>
                      </div>

                      <Toggle
                        checked={
                          autoGenerateReports
                        }
                        onChange={
                          setAutoGenerateReports
                        }
                        label="Auto-generate Draft Reports"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAI}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg border-none bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 active:scale-95"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save AI Configuration
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#070A11] p-5 sm:p-6">
                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        PATHOLOGY ALERT
                        THRESHOLDS
                      </p>
                    </div>

                    <div className="space-y-4">
                      {alerts.map((alert) => {
                        const priorityClasses =
                          getPriorityClasses(
                            alert.priority
                          );

                        return (
                          <div
                            key={alert.id}
                            className="flex min-h-[72px] items-center gap-3 rounded-xl border border-slate-800 bg-[#0B121E] px-3 py-3"
                          >
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${priorityClasses.dot} shadow-[0_0_8px_currentColor]`}
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-5 text-slate-200">
                                {alert.title}
                              </p>
                            </div>

                            <span
                              className={`hidden shrink-0 rounded-md px-3 py-2 text-xs font-medium sm:inline-flex ${priorityClasses.badge}`}
                            >
                              {alert.priority}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                cyclePriority(
                                  alert.id
                                )
                              }
                              aria-label={`Edit ${alert.title} priority`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "security" && (
            <SettingsPanel
              icon={Shield}
              title="Account Security"
              description="Manage authentication, session controls, and clinical account protection."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TogglePanel
                  title="Two Factor Authentication"
                  description="Require an additional verification step when signing in."
                  checked={twoFactor}
                  onChange={setTwoFactor}
                />

                <div className="rounded-xl border border-slate-800 bg-[#070A11] p-5">
                  <p className="text-sm font-bold text-white">
                    Session Timeout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Automatically terminate
                    inactive sessions.
                  </p>

                  <select
                    value={sessionTimeout}
                    onChange={(event) =>
                      setSessionTimeout(
                        event.target.value
                      )
                    }
                    className="mt-5 h-11 w-full appearance-none rounded-xl border border-slate-800 bg-[#070A11] px-4 text-xs text-slate-100 outline-none transition-all duration-200 hover:border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 [color-scheme:dark]"
                  >
                    <option
                      className="bg-[#070A11] text-slate-100"
                      value="15"
                    >
                      15 minutes
                    </option>
                    <option
                      className="bg-[#070A11] text-slate-100"
                      value="30"
                    >
                      30 minutes
                    </option>
                    <option
                      className="bg-[#070A11] text-slate-100"
                      value="60"
                    >
                      1 hour
                    </option>
                    <option
                      className="bg-[#070A11] text-slate-100"
                      value="120"
                    >
                      2 hours
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <PrimaryButton
                  onClick={handleSaveSecurity}
                >
                  <Save className="h-3.5 w-3.5" />
                  Update Security
                </PrimaryButton>
              </div>
            </SettingsPanel>
          )}

          {activeTab === "ai" && (
            <SettingsPanel
              icon={Cpu}
              title="AI Model Parameters"
              description="Configure AI detection behavior and diagnostic assistance preferences."
            >
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-800 bg-[#070A11] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Confidence Threshold
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Minimum AI confidence
                        required before a
                        finding is surfaced.
                      </p>
                    </div>

                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {sensitivity}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={sensitivity}
                    onChange={(event) =>
                      setSensitivity(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-6 h-2 w-full cursor-pointer accent-cyan-500"
                  />
                </div>

                <TogglePanel
                  title="Auto-generate Draft Reports"
                  description="Automatically prepare a draft report after AI analysis."
                  checked={autoGenerateReports}
                  onChange={
                    setAutoGenerateReports
                  }
                />

                <div className="rounded-xl border border-slate-800 bg-[#070A11] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Pathology Alert Priorities
                  </p>

                  <div className="mt-4 space-y-3">
                    {alerts.map((alert) => {
                      const priorityClasses =
                        getPriorityClasses(
                          alert.priority
                        );

                      return (
                        <div
                          key={alert.id}
                          className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0B121E] p-4"
                        >
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${priorityClasses.dot}`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-200">
                              {alert.title}
                            </p>
                          </div>

                          <span
                            className={`hidden rounded-md px-3 py-1.5 text-[10px] font-bold sm:inline-flex ${priorityClasses.badge}`}
                          >
                            {alert.priority}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              cyclePriority(
                                alert.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
                            aria-label={`Change ${alert.title} priority`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <PrimaryButton
                    onClick={handleSaveAI}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Configuration
                  </PrimaryButton>
                </div>
              </div>
            </SettingsPanel>
          )}

          {activeTab === "integration" && (
            <SettingsPanel
              icon={Layers}
              title="PACS & DICOM Integration"
              description="Configure connectivity with your hospital imaging infrastructure."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SettingsInput
                  label="PACS SERVER URL"
                  value={pacsUrl}
                  onChange={setPacsUrl}
                  placeholder="https://pacs.example.com"
                />

                <SettingsInput
                  label="PORT"
                  value={pacsPort}
                  onChange={setPacsPort}
                  placeholder="8042"
                  mono
                />

                <SettingsInput
                  label="AE TITLE / KEY"
                  value={aeTitle}
                  onChange={setAeTitle}
                  placeholder="CLINIVISION_AE"
                  mono
                />

                <TogglePanel
                  title="HL7 Integration"
                  description="Enable the clinical messaging bridge for connected hospital systems."
                  checked={hl7Enabled}
                  onChange={setHl7Enabled}
                />
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-[#070A11] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-100">
                      Connection Status
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Validate PACS connectivity before
                      using the configuration in a
                      production environment.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#070A11] px-5 py-2.5 text-xs font-bold text-slate-200 transition hover:border-cyan-400/50 hover:bg-[#0B121E] hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {testingConnection
                    ? "Testing Connection..."
                    : "Test Connection"}
                </button>

                <PrimaryButton
                  onClick={handleSaveConnection}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Connection
                </PrimaryButton>
              </div>
            </SettingsPanel>
          )}

          {activeTab === "alerts" && (
            <SettingsPanel
              icon={Sliders}
              title="Display & Alerts"
              description="Configure clinical notifications and interface preferences."
            >
              <div className="space-y-3">
                <TogglePanel
                  title="Email Notifications"
                  description="Receive important system notifications by email."
                  checked={emailNotifications}
                  onChange={
                    setEmailNotifications
                  }
                />

                <TogglePanel
                  title="Critical Scan Alerts"
                  description="Receive immediate notifications for critical findings."
                  checked={criticalAlerts}
                  onChange={setCriticalAlerts}
                />

                <TogglePanel
                  title="Report Updates"
                  description="Receive notifications when reports are finalized or updated."
                  checked={reportUpdates}
                  onChange={setReportUpdates}
                />

                <TogglePanel
                  title="Dark Clinical Interface"
                  description="Use the optimized dark interface throughout the application."
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-[#070A11] p-5">
                <p className="text-sm font-bold text-slate-100">
                  Clinical Interface Theme
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  CliniVision uses a high-contrast dark
                  clinical interface designed to
                  reduce visual fatigue in image-heavy
                  diagnostic workflows.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-slate-800 bg-[#0B121E] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                    Background #070A11
                  </span>

                  <span className="rounded-lg border border-slate-800 bg-[#0B121E] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                    Cyan Accent
                  </span>

                  <span className="rounded-lg border border-slate-800 bg-[#0B121E] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Clinical Status
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <PrimaryButton
                  onClick={handleSaveAlerts}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Preferences
                </PrimaryButton>
              </div>
            </SettingsPanel>
          )}

          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B121E] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                  Protected Environment
                </p>

                <p className="mt-1 max-w-3xl text-[8px] leading-4 text-slate-500">
                  Clinical configuration is
                  protected by application access
                  controls. Connect this interface
                  to your production identity,
                  audit, encryption, and policy
                  services before processing real
                  patient information.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingsInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border border-slate-800 bg-[#070A11] px-4 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        className={`min-w-[24px] text-right text-[9px] font-black uppercase tracking-wider transition-colors ${
          checked
            ? "text-emerald-400"
            : "text-slate-500"
        }`}
        aria-hidden="true"
      >
        {checked ? "ON" : "OFF"}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${
          checked ? "On" : "Off"
        }`}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A11] ${
          checked
            ? "border-emerald-300/80 bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.30)]"
            : "border-slate-600 bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full transition-all duration-300 ease-out ${
            checked
              ? "left-[25px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              : "left-[3px] bg-slate-950 shadow-[0_1px_5px_rgba(0,0,0,0.45)]"
          }`}
        />
      </button>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg border-none bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-400 active:scale-95"
    >
      {children}
    </button>
  );
}

function SettingsPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0B121E] shadow-2xl shadow-black/10">
      <div className="border-b border-slate-800/80 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
            <Icon className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              {title}
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {children}
      </div>
    </section>
  );
}

function TogglePanel({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-5 rounded-xl border p-5 transition-all duration-200 ${
        checked
          ? "border-slate-700/90 bg-[#0B121E]"
          : "border-slate-800 bg-[#070A11]"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-100">
            {title}
          </p>

          {checked && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)]"
              aria-hidden="true"
            />
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}