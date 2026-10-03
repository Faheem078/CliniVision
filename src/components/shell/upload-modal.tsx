"use client";

import { useState, DragEvent } from "react";
import {
  X,
  UploadCloud,
  Loader2,
  FileImage,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  onClose: () => void;
}

interface PredictResponse {
  prediction: string;
  confidence: number;
  heatmap_url: string;
  risk_level: string;
  summary: string;
  care_suggestions: {
    rest: string;
    diet: string;
    hydration: string;
    warning_signs: string;
    follow_up: string;
  };
  disclaimer: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sharjeel0415-radiai-backend.hf.space";

export default function UploadModal({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setResult(null);
      setError(null);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
    setError(null);
  }

  async function startAnalysis() {
    if (!file || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.detail || `Server error: ${response.status}`
        );
      }

      const data: PredictResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(
        err.message ||
          "Backend se connect nahi hua. Make sure Hugging Face backend is live."
      );
    } finally {
      setLoading(false);
    }
  }

  const heatmapFullUrl = result?.heatmap_url
    ? result.heatmap_url.startsWith("http")
      ? result.heatmap_url
      : `${API_URL}${result.heatmap_url}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Chest X-Ray Analysis
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload X-ray for Pneumonia detection
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-white/5"
          >
            <X className="text-slate-400" />
          </button>
        </div>

        {!result && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-xl border border-dashed border-cyan-400/40 bg-[#111827] p-10 text-center transition hover:border-cyan-400/70"
          >
            {file ? (
              <FileImage size={45} className="mx-auto mb-4 text-cyan-400" />
            ) : (
              <UploadCloud size={45} className="mx-auto mb-4 text-[#00F0FF]" />
            )}
            <p className="mt-3 text-sm text-slate-300">
              {file ? "File selected" : "Drag and Drop your X-ray here"}
            </p>
            <p className="mt-1 text-xs text-slate-500">JPG, PNG or DICOM</p>
            <label className="mt-5 inline-flex cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
              Choose File
              <input
                type="file"
                accept=".dcm,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <p className="mt-4 truncate text-xs text-cyan-400">{file.name}</p>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-3 py-6 text-cyan-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm">AI analyzing X-ray...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 size={18} />
              Analysis complete
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111827] p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Prediction</span>
                <span
                  className={`text-sm font-bold ${
                    result.prediction === "Pneumonia"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {result.prediction}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Confidence</span>
                <span className="text-sm font-bold text-cyan-300">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${Math.min(result.confidence * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Risk Level</span>
                <span className="text-sm font-semibold text-amber-300">
                  {result.risk_level}
                </span>
              </div>

              {result.summary && (
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                  {result.summary}
                </p>
              )}
            </div>

            {heatmapFullUrl && (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 px-3 py-2 bg-[#111827]">
                  Grad-CAM Heatmap
                </p>
                <img
                  src={heatmapFullUrl}
                  alt="Grad-CAM Heatmap"
                  className="w-full object-contain bg-black"
                />
              </div>
            )}

            {result.care_suggestions && (
              <div className="rounded-xl border border-white/10 bg-[#111827] p-4 space-y-2">
                <p className="text-xs font-semibold text-white">
                  Care Suggestions
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Rest: {result.care_suggestions.rest}</li>
                  <li>• Diet: {result.care_suggestions.diet}</li>
                  <li>• Hydration: {result.care_suggestions.hydration}</li>
                  <li>• Warning: {result.care_suggestions.warning_signs}</li>
                  <li>• Follow-up: {result.care_suggestions.follow_up}</li>
                </ul>
                <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  {result.disclaimer}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setResult(null);
                setError(null);
              }}
              className="w-full rounded-xl border border-white/10 py-3 text-sm text-slate-300 hover:bg-white/5"
            >
              Upload another image
            </button>
          </div>
        )}

        {!result && (
          <button
            type="button"
            disabled={!file || loading}
            onClick={startAnalysis}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00F0FF] py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Start AI Analysis"
            )}
          </button>
        )}
      </div>
    </div>
  );
}