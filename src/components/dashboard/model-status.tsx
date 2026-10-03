"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";

interface AIModel {
  name: string;
  status: "Online" | "Updating" | "Offline";
  latency: string;
  online: boolean;
}

const models: AIModel[] = [
  {
    name: "ThoracicNet v3.2",
    status: "Online",
    latency: "1.2s",
    online: true,
  },
  {
    name: "NeuroScan Pro",
    status: "Online",
    latency: "2.4s",
    online: true,
  },
  {
    name: "OrthoDetect X",
    status: "Updating",
    latency: "4m 12s",
    online: false,
  },
];

export default function ModelStatus() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          AI Model Status
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
          {models.filter((m) => m.online).length}/{models.length} Active
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {models.map((model) => (
          <div
            key={model.name}
            className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-slate-100">{model.name}</p>
              <p className="text-xs text-slate-400">
                Processing latency:{" "}
                <span className="text-slate-300 font-mono">{model.latency}</span>
              </p>
            </div>

            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                model.online
                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                  : "text-amber-400 border-amber-500/20 bg-amber-500/10"
              }`}
            >
              {model.online ? (
                <CheckCircle2 size={13} className="shrink-0" />
              ) : (
                <RefreshCw size={13} className="shrink-0 animate-spin" />
              )}
              <span>{model.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}