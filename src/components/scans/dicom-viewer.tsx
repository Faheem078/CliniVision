"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Eye,
  RotateCcw,
  Layers,
} from "lucide-react";

interface DicomViewerProps {
  imageSrc?: string;
  heatmapUrl?: string;
}

export default function DicomViewer({
  imageSrc = "/person1_virus_11.jpeg",
  heatmapUrl = "http://127.0.0.1:8000/static/person1_virus_11.jpeg_heatmap.png",
}: DicomViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showHeatmap, setShowHeatmap] = useState(true);

  function reset() {
    setZoom(100);
    setBrightness(100);
    setContrast(100);
    setShowHeatmap(true);
  }

  // Full URL banayein agar backend ne relative URL bheji ho
  const fullHeatmapUrl = heatmapUrl
    ? heatmapUrl.startsWith("http")
      ? heatmapUrl
      : `http://127.0.0.1:8000${heatmapUrl}`
    : null;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-black overflow-hidden min-h-[620px]">
      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2 rounded-xl bg-[#0F172A]/90 border border-white/10 p-2 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(200, z + 10))}
          title="Zoom In"
          className="rounded-lg bg-white/5 p-2 text-cyan-300 hover:bg-white/10 transition"
        >
          <ZoomIn size={18} />
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(50, z - 10))}
          title="Zoom Out"
          className="rounded-lg bg-white/5 p-2 text-cyan-300 hover:bg-white/10 transition"
        >
          <ZoomOut size={18} />
        </button>

        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          title={showHeatmap ? "Hide Grad-CAM Heatmap" : "Show Grad-CAM Heatmap"}
          className={`rounded-lg p-2 transition ${
            showHeatmap
              ? "bg-rose-500/20 text-[#FFB4AB] border border-rose-500/30"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          <Eye size={18} />
        </button>

        <button
          type="button"
          onClick={reset}
          title="Reset View"
          className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10 transition"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Top Right Badges */}
      <div className="absolute right-4 top-4 z-20 space-y-2">
        <div className="rounded-lg bg-[#0F172A]/90 border border-white/10 px-4 py-2 text-xs text-slate-300 backdrop-blur-md">
          Zoom: {zoom}%
        </div>
        {showHeatmap && fullHeatmapUrl && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 backdrop-blur-md">
            <Layers size={14} /> Grad-CAM Active
          </div>
        )}
      </div>

      {/* Main Image Stage */}
      <div className="flex items-center justify-center h-full min-h-[620px] p-6 overflow-hidden">
        <div
          className="relative max-h-[500px] max-w-[500px] rounded-xl overflow-hidden transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoom / 100})`,
          }}
        >
          {/* Base X-Ray Image */}
          <img
            src={imageSrc}
            alt="Chest X-Ray"
            className="h-[460px] w-[460px] object-contain rounded-xl select-none"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            }}
          />

          {/* Real Grad-CAM Heatmap Overlay */}
          {showHeatmap && fullHeatmapUrl && (
            <img
              src={fullHeatmapUrl}
              alt="Grad-CAM Activation"
              className="absolute inset-0 h-[460px] w-[460px] object-contain mix-blend-screen opacity-80 pointer-events-none transition-opacity duration-200"
            />
          )}

          {/* Diagnosis Badge */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 border border-white/10 px-3 py-1 text-xs font-mono text-cyan-300 backdrop-blur-sm">
            AI Localization View
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0F172A]/90 p-4 flex flex-wrap gap-8 items-center justify-center backdrop-blur-md z-20">
        <div className="flex items-center gap-3 text-slate-300 text-xs">
          <Sun size={16} className="text-amber-400" />
          <span>Brightness</span>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-slate-400 w-8">{brightness}%</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-xs">
          <Contrast size={16} className="text-cyan-400" />
          <span>Contrast</span>
          <input
            type="range"
            min="50"
            max="150"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-slate-400 w-8">{contrast}%</span>
        </div>
      </div>
    </div>
  );
}