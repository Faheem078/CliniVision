"use client";

import { AlertCircle, CheckCircle2, HeartPulse, Stethoscope } from "lucide-react";

interface CareSuggestions {
  rest?: string;
  diet?: string;
  hydration?: string;
  warning_signs?: string;
  follow_up?: string;
}

interface DiagnosticsCardProps {
  prediction?: string;
  confidence?: number;
  riskLevel?: string;
  summary?: string;
  careSuggestions?: CareSuggestions;
  disclaimer?: string;
}

export default function DiagnosticsCard({
  prediction = "Pneumonia",
  confidence = 0.8977,
  riskLevel = "High",
  summary = "Based on the analysis, the model shows 89.8% confidence for Pneumonia.",
  careSuggestions = {
    rest: "Get plenty of rest.",
    diet: "Eat a balanced diet.",
    hydration: "Stay hydrated.",
    warning_signs: "If you experience difficulty breathing, seek immediate care.",
    follow_up: "Consult a doctor within 24 hours.",
  },
  disclaimer = "This is an AI-assisted preliminary assessment and not a final medical diagnosis. Please consult a qualified doctor.",
}: DiagnosticsCardProps) {
  const isPneumonia = prediction.toLowerCase().includes("pneumonia");
  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6 space-y-6 shadow-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={20} className="text-[#00F0FF]" />
          <h2 className="text-lg font-semibold text-white">AI Diagnostics Findings</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold border ${
            isPneumonia
              ? "bg-rose-500/10 text-[#FFB4AB] border-rose-500/30"
              : "bg-emerald-500/10 text-[#4DE082] border-emerald-500/30"
          }`}
        >
          {riskLevel} Risk
        </span>
      </div>

      {/* Primary Classification Bar */}
      <div className="space-y-3 rounded-xl border border-white/5 bg-[#111827] p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium text-base">{prediction}</p>
            <p className="text-xs text-slate-400">Deep Learning Dual-Class Model</p>
          </div>
          <span className="text-base font-mono font-bold text-cyan-300">
            {confidencePercent}%
          </span>
        </div>

        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPneumonia ? "bg-rose-500" : "bg-emerald-400"
            }`}
            style={{ width: `${Math.min(Number(confidencePercent), 100)}%` }}
          />
        </div>

        {summary && (
          <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-white/5">
            {summary}
          </p>
        )}
      </div>

      {/* Clinical Protocol / Care Suggestions */}
      {careSuggestions && (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-white font-medium text-xs uppercase tracking-wider">
            <HeartPulse size={15} className="text-cyan-400" />
            <span>Recommended Clinical Protocol</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
            {careSuggestions.rest && (
              <li>• <strong className="text-slate-400">Rest:</strong> {careSuggestions.rest}</li>
            )}
            {careSuggestions.diet && (
              <li>• <strong className="text-slate-400">Diet:</strong> {careSuggestions.diet}</li>
            )}
            {careSuggestions.hydration && (
              <li>• <strong className="text-slate-400">Hydration:</strong> {careSuggestions.hydration}</li>
            )}
            {careSuggestions.warning_signs && (
              <li className="text-rose-300">
                • <strong>Warning:</strong> {careSuggestions.warning_signs}
              </li>
            )}
            {careSuggestions.follow_up && (
              <li>• <strong className="text-slate-400">Follow-up:</strong> {careSuggestions.follow_up}</li>
            )}
          </ul>
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Grad-CAM Heatmap Legend
        </h3>
        <div className="space-y-1.5 text-xs">
          <p className="flex items-center gap-2 text-[#FFB4AB]">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            Critical Infection Density (&gt;85%)
          </p>
          <p className="flex items-center gap-2 text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
            Suspicious Infiltration (50–85%)
          </p>
          <p className="flex items-center gap-2 text-[#4DE082]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            Normal Parenchyma Clear (&lt;50%)
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      {disclaimer && (
        <div className="flex items-start gap-2 rounded-lg bg-white/[0.02] border border-white/5 p-3 text-[11px] text-slate-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-slate-500" />
          <span>{disclaimer}</span>
        </div>
      )}
    </div>
  );
}