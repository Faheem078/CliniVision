"use client";

import { useRouter } from "next/navigation";
import { Eye, History, AlertCircle, CheckCircle2 } from "lucide-react";

interface QueueCardProps {
  id: string;
  patient: string;
  modality: string;
  condition: string;
  confidence: number;
  status: "Detected" | "Pending" | "Normal";
  onHistory?: () => void;
}

export default function QueueCard({
  id,
  patient,
  modality,
  condition,
  confidence,
  status,
  onHistory,
}: QueueCardProps) {
  const router = useRouter();

  // Clamp confidence score between 0 and 100
  const clampedConfidence = Math.min(Math.max(confidence, 0), 100);

  const statusConfig = {
    Detected: {
      border: "border-l-[#FFB4AB]",
      bgBar: "bg-[#FFB4AB]",
      badge: "border-[#FFB4AB]/40 bg-[#FFB4AB]/10 text-[#FFB4AB]",
      icon: <AlertCircle className="h-9 w-9 text-[#FFB4AB]/50" />,
      time: "14 mins ago",
    },
    Normal: {
      border: "border-l-[#4DE082]",
      bgBar: "bg-[#4DE082]",
      badge: "border-[#4DE082]/40 bg-[#4DE082]/10 text-[#4DE082]",
      icon: <CheckCircle2 className="h-9 w-9 text-[#4DE082]/50" />,
      time: "1 hr ago",
    },
    Pending: {
      border: "border-l-[#89CEFF]", // Fixed invalid hex #8SCEFF -> #89CEFF
      bgBar: "bg-[#89CEFF]",
      badge: "border-cyan-300/30 bg-cyan-300/10 text-cyan-300",
      icon: <Eye className="h-9 w-9 text-cyan-300/40" />,
      time: "42 mins ago",
    },
  }[status];

  function reviewScan() {
    router.push(`/scans?scanId=${encodeURIComponent(id)}`);
  }

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[#1E2638] border-l-4 ${statusConfig.border} bg-[#111622]/80 p-5 backdrop-blur-md transition hover:border-white/15`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Thumbnail / Icon Container */}
        <div className="flex h-24 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1E2638] bg-[#0B0F17]">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-4 rounded-lg border border-cyan-400/10" />
            {statusConfig.icon}
          </div>
        </div>

        {/* Details Container */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Patient: {patient}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {modality}
                <span className="mx-2 text-slate-600">•</span>
                {statusConfig.time}
              </p>
            </div>

            <span
              className={`h-fit rounded-full border px-3 py-1.5 text-xs font-medium ${statusConfig.badge}`}
            >
              {condition}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">AI Confidence Score</span>
              <span className="font-semibold text-slate-200">
                {clampedConfidence}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#1E2638]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${statusConfig.bgBar}`}
                style={{ width: `${clampedConfidence}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reviewScan}
              className="flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-300/20 active:scale-[0.98]"
            >
              <Eye className="h-4 w-4" />
              Review Scan
            </button>

            {onHistory && (
              <button
                type="button"
                onClick={onHistory}
                className="flex items-center gap-2 rounded-lg border border-[#1E2638] bg-[#182030] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white active:scale-[0.98]"
              >
                <History className="h-4 w-4" />
                View History
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}