"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DicomViewer from "@/components/scans/dicom-viewer";
import DiagnosticsCard from "@/components/scans/diagnostics-card";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sharjeel0415-radiai-backend.hf.space";

export default function ScanAnalysisPage({ params, searchParams }: PageProps) {
  const [toast, setToast] = useState("");

  const patientId =
    params?.id ||
    (typeof searchParams?.patientId === "string"
      ? searchParams.patientId
      : "RAD-2026-9485");

  const patientName =
    (typeof searchParams?.patientName === "string" && searchParams.patientName) ||
    "person3_bacteria_11";

  const imageSrc =
    (typeof searchParams?.imageSrc === "string" && searchParams.imageSrc) ||
    `${API_BASE_URL}/static/person3_bacteria_11.jpeg`;

  const heatmapUrl =
    (typeof searchParams?.heatmapUrl === "string" && searchParams.heatmapUrl) ||
    `${API_BASE_URL}/static/person3_bacteria_11.jpeg_heatmap.png`;

  const prediction =
    (typeof searchParams?.prediction === "string" && searchParams.prediction) ||
    "Pneumonia";

  const confidence =
    typeof searchParams?.confidence === "string"
      ? parseFloat(searchParams.confidence)
      : 0.9485;

  const riskLevel =
    (typeof searchParams?.riskLevel === "string" && searchParams.riskLevel) ||
    "High";

  const isCritical = prediction.toLowerCase().includes("pneumonia");

  function finalize() {
    setToast("Clinical report generated & digitally signed successfully");
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="space-y-8 p-6 bg-[#090D16] min-h-screen text-white">
      <Link
        href="/scans"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition"
      >
        <ArrowLeft size={16} /> Back to All Scans
      </Link>

      <header className="flex flex-col md:flex-row justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Diagnostic Scan Workspace
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Patient ID: <span className="text-slate-200 font-mono">{patientId}</span> • Scan: {patientName}
          </p>

          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border ${
              isCritical
                ? "bg-rose-500/10 border-rose-500/30 text-[#FFB4AB]"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {isCritical ? (
              <>
                <AlertTriangle size={14} />
                Critical Finding: Pneumonia Detected
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Normal Study: Clear Parenchyma
              </>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={finalize}
          className="h-fit self-start md:self-auto rounded-xl bg-[#00F0FF] px-6 py-3 font-semibold text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition"
        >
          Finalize Report
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Central Viewer with Real Heatmap */}
        <div className="xl:col-span-2">
          <DicomViewer imageSrc={imageSrc} heatmapUrl={heatmapUrl} />
        </div>

        {/* Right AI Findings Sidebar */}
        <div>
          <DiagnosticsCard
            prediction={prediction}
            confidence={confidence}
            riskLevel={riskLevel}
          />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-emerald-500 px-5 py-3 text-black font-medium flex items-center gap-2 shadow-2xl z-50">
          <CheckCircle size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}