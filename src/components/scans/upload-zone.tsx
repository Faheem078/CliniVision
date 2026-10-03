"use client";

import { useState, DragEvent, useRef, ChangeEvent } from "react";
import {
  UploadCloud,
  FileImage,
  ScanLine,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

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

export default function UploadZone() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
      setResult(null);
      setError(null);
    }
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  }

  async function startAnalysis() {
    if (!selectedFile || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Server error: ${response.status}`);
      }

      const data: PredictResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(
        err.message || "Backend se connect nahi hua. Make sure Hugging Face backend is live."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const heatmapFullUrl = result?.heatmap_url
    ? result.heatmap_url.startsWith("http")
      ? result.heatmap_url
      : `${API_URL}${result.heatmap_url}`
    : null;

  return (
    <div className="w-full space-y-6">
      <div
        className="rounded-3xl border border-dashed border-cyan-400/40 bg-[#0F172A] p-10 text-center backdrop-blur-md transition hover:border-cyan-400/80"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".dcm,.png,.jpg,.jpeg"
          className="hidden"
        />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
          <UploadCloud size={34} className="text-[#00F0FF]" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-white">
          Drag & Drop your DICOM or X-Ray file here
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Upload medical images for AI-powered diagnosis & Grad-CAM analysis
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[".DCM", ".PNG", ".JPG"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {selectedFile && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <FileImage size={16} />
            <span className="font-mono">{selectedFile.name}</span>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <ScanLine size={18} />
            Select Image
          </button>

          {selectedFile && (
            <button
              type="button"
              disabled={loading}
              onClick={startAnalysis}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00F0FF] px-6 py-3 font-semibold text-black shadow-[0_0_25px_rgba(0,240,255,.25)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <ScanLine size={18} />
                  Analyze with AI
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
              <CheckCircle2 size={16} /> Analysis Completed
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
            >
              <RotateCcw size={14} /> Clear Result
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[#111827] p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Diagnosis</p>
              <p
                className={`mt-1 text-xl font-bold ${
                  result.prediction === "Pneumonia" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {result.prediction}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Confidence</p>
              <p className="mt-1 text-xl font-bold text-cyan-300">
                {(result.confidence * 100).toFixed(2)}%
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#00F0FF]"
                  style={{ width: `${Math.min(result.confidence * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Risk Assessment</p>
              <p className="mt-1 text-xl font-bold text-amber-300">{result.risk_level}</p>
            </div>
          </div>

          {result.summary && (
            <p className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-300">
              {result.summary}
            </p>
          )}

          {heatmapFullUrl && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Grad-CAM Activation Heatmap
              </p>
              <div className="flex justify-center bg-black/60 p-2 rounded-xl">
                <img
                  src={heatmapFullUrl}
                  alt="Grad-CAM Visualization"
                  className="max-h-96 rounded-lg object-contain shadow-lg"
                />
              </div>
            </div>
          )}

          {result.care_suggestions && (
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2">
              <p className="text-xs font-semibold text-white">Suggested Protocol</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• <strong className="text-slate-300">Rest:</strong> {result.care_suggestions.rest}</li>
                <li>• <strong className="text-slate-300">Diet:</strong> {result.care_suggestions.diet}</li>
                <li>• <strong className="text-slate-300">Hydration:</strong> {result.care_suggestions.hydration}</li>
                <li>• <strong className="text-slate-300">Warning:</strong> {result.care_suggestions.warning_signs}</li>
                <li>• <strong className="text-slate-300">Follow-up:</strong> {result.care_suggestions.follow_up}</li>
              </ul>
              <p className="border-t border-white/5 pt-2 text-[10px] text-slate-500">
                {result.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}