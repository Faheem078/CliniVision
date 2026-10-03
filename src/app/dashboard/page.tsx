"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Filter, 
  Activity, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Eye,
  History,
  FileCheck,
  ChevronDown,
  X,
  UploadCloud
} from "lucide-react";

interface ScanQueueItem {
  id: string;
  patientId: string;
  scanType: string;
  timeAgo: string;
  anomalyType: string;
  anomalySeverity: "critical" | "minor" | "clear";
  confidence: number;
  thumbnailIcon: string;
}

export default function PhysicianDashboard() {
  const router = useRouter();
  
  // Interactive States (Updated type to include 'pending')
  const [filterType, setFilterType] = useState<"all" | "critical" | "minor" | "clear" | "pending">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [signedOffIds, setSignedOffIds] = useState<string[]>([]);

  // Queue Data
  const queueData: ScanQueueItem[] = [
    {
      id: "scan-1",
      patientId: "ID-8924A",
      scanType: "Chest X-Ray (PA/LAT)",
      timeAgo: "14 mins ago",
      anomalyType: "Susp. Pneumonia",
      anomalySeverity: "critical",
      confidence: 94,
      thumbnailIcon: "alert",
    },
    {
      id: "scan-2",
      patientId: "ID-4412B",
      scanType: "MRI Brain w/wo Contrast",
      timeAgo: "42 mins ago",
      anomalyType: "Minor Anomaly",
      anomalySeverity: "minor",
      confidence: 68,
      thumbnailIcon: "eye",
    },
    {
      id: "scan-3",
      patientId: "ID-1109C",
      scanType: "CT Abdomen/Pelvis",
      timeAgo: "1 hr ago",
      anomalyType: "Clear",
      anomalySeverity: "clear",
      confidence: 99,
      thumbnailIcon: "check",
    },
  ];

  // Filter Logic (Updated to handle 'pending' scans)
  const filteredQueue = queueData.filter((item) => {
    if (filterType === "critical") return item.anomalySeverity === "critical";
    if (filterType === "minor") return item.anomalySeverity === "minor";
    if (filterType === "clear") return item.anomalySeverity === "clear";
    if (filterType === "pending") {
      // Pending reviews: Scans not yet signed off or critical/minor items needing review
      return !signedOffIds.includes(item.id) && item.anomalySeverity !== "clear";
    }
    return true;
  });

  const handleReviewScan = (patientId: string) => {
    router.push(`/scans?patient=${patientId}`);
  };

  const handleSignOff = (id: string) => {
    setSignedOffIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="text-xs font-semibold text-[#00F0FF] tracking-wider uppercase">
              System Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Physician Dashboard</h1>
          <p className="text-xs text-slate-400">Clinical imaging intelligence and review queue</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative">
          {/* Filter Queue Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182030] border border-[#1E2638] hover:border-[#00F0FF]/50 text-slate-200 text-sm font-medium transition-all"
            >
              <Filter className="w-4 h-4 text-[#00F0FF]" />
              <span>Filter Queue</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#182030] border border-[#1E2638] shadow-2xl py-2 z-50">
                <button
                  onClick={() => { setFilterType("all"); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#1E2638] ${filterType === "all" ? "text-[#00F0FF]" : "text-slate-300"}`}
                >
                  All Scans ({queueData.length})
                </button>
                <button
                  onClick={() => { setFilterType("critical"); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#1E2638] ${filterType === "critical" ? "text-[#FFB4AB]" : "text-slate-300"}`}
                >
                  Critical Anomalies
                </button>
                <button
                  onClick={() => { setFilterType("minor"); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#1E2638] ${filterType === "minor" ? "text-amber-400" : "text-slate-300"}`}
                >
                  Minor Anomalies
                </button>
                <button
                  onClick={() => { setFilterType("pending"); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#1E2638] ${filterType === "pending" ? "text-amber-400" : "text-slate-300"}`}
                >
                  Pending Reviews
                </button>
                <button
                  onClick={() => { setFilterType("clear"); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#1E2638] ${filterType === "clear" ? "text-[#4DE082]" : "text-slate-300"}`}
                >
                  Clear Cases
                </button>
              </div>
            )}
          </div>

          {/* + New Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold text-sm transition-all shadow-lg shadow-[#00F0FF]/15 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Upload</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans Card */}
        <div 
          onClick={() => setFilterType("all")}
          className={`p-4 rounded-2xl bg-[#111622]/80 border cursor-pointer transition-all group ${
            filterType === "all" ? "border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10" : "border-[#1E2638] hover:border-[#00F0FF]/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Total Scans Today</span>
            <Activity className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">142</div>
          <span className="text-[11px] font-semibold text-[#4DE082] bg-[#4DE082]/10 px-2 py-0.5 rounded-md inline-block mt-2">
            ↑ 12%
          </span>
        </div>

        {/* AI Anomalies Card */}
        <div 
          onClick={() => setFilterType("critical")}
          className={`p-4 rounded-2xl bg-[#111622]/80 border cursor-pointer transition-all group ${
            filterType === "critical" ? "border-[#FFB4AB] shadow-lg shadow-[#FFB4AB]/10" : "border-[#1E2638] hover:border-[#FFB4AB]/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">AI Anomalies Detected</span>
            <AlertTriangle className="w-4 h-4 text-[#FFB4AB] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#FFB4AB] mt-2">18</div>
          <span className="text-[11px] font-semibold text-[#FFB4AB] bg-[#FFB4AB]/10 px-2 py-0.5 rounded-md inline-block mt-2">
            +3 in last hour
          </span>
        </div>

        {/* Pending Reviews Card (UPDATED & WORKABLE) */}
        <div 
          onClick={() => setFilterType("pending")}
          className={`p-4 rounded-2xl bg-[#111622]/80 border cursor-pointer transition-all group ${
            filterType === "pending" ? "border-amber-400 shadow-lg shadow-amber-400/10" : "border-[#1E2638] hover:border-amber-400/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">45</div>
          <span className="text-[11px] font-medium text-slate-400 block mt-2">
            Est. 2h 15m
          </span>
        </div>

        {/* Completed Reports Card */}
        <div 
          onClick={() => setFilterType("clear")}
          className={`p-4 rounded-2xl bg-[#111622]/80 border cursor-pointer transition-all group ${
            filterType === "clear" ? "border-[#4DE082] shadow-lg shadow-[#4DE082]/10" : "border-[#1E2638] hover:border-[#4DE082]/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Completed Reports</span>
            <CheckCircle2 className="w-4 h-4 text-[#4DE082] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">79</div>
          <span className="text-[11px] font-semibold text-[#4DE082] bg-[#4DE082]/10 px-2 py-0.5 rounded-md inline-block mt-2">
            Complete
          </span>
        </div>
      </div>

      {/* Main Grid: Priority Queue & AI Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Scan Queue (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Priority Scan Queue
              </h2>
              <p className="text-xs text-slate-400">
                {filteredQueue.length} scans matching current filter ({filterType.toUpperCase()})
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-[#182030] px-3 py-1 rounded-full border border-[#1E2638]">
              Sorted by AI Risk Score
            </span>
          </div>

          <div className="space-y-4">
            {filteredQueue.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#111622]/80 border border-[#1E2638] text-center text-slate-400 text-xs">
                No scans found for the selected filter.
              </div>
            ) : (
              filteredQueue.map((item) => {
                const isSignedOff = signedOffIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl bg-[#111622]/80 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      item.anomalySeverity === "critical"
                        ? "border-[#FFB4AB]/40 bg-[#FFB4AB]/5"
                        : item.anomalySeverity === "minor"
                        ? "border-amber-500/30"
                        : "border-[#4DE082]/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Diagnostic Thumbnail Icon */}
                      <div className="w-16 h-16 rounded-xl bg-[#0B0F17] border border-[#1E2638] flex items-center justify-center flex-shrink-0">
                        {item.anomalySeverity === "critical" ? (
                          <AlertTriangle className="w-7 h-7 text-[#FFB4AB]" />
                        ) : item.anomalySeverity === "minor" ? (
                          <Eye className="w-7 h-7 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-7 h-7 text-[#4DE082]" />
                        )}
                      </div>

                      {/* Patient Meta */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-base">Patient: {item.patientId}</h3>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              item.anomalySeverity === "critical"
                                ? "bg-[#FFB4AB]/10 text-[#FFB4AB] border-[#FFB4AB]/30"
                                : item.anomalySeverity === "minor"
                                ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                                : "bg-[#4DE082]/10 text-[#4DE082] border-[#4DE082]/30"
                            }`}
                          >
                            {item.anomalyType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {item.scanType} • {item.timeAgo}
                        </p>

                        {/* AI Confidence Bar */}
                        <div className="w-48 pt-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                            <span>AI Confidence Score</span>
                            <span className="text-white">{item.confidence}%</span>
                          </div>
                          <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.anomalySeverity === "critical"
                                  ? "bg-[#FFB4AB]"
                                  : item.anomalySeverity === "minor"
                                  ? "bg-amber-400"
                                  : "bg-[#4DE082]"
                              }`}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                      {item.anomalySeverity === "clear" ? (
                        <button
                          onClick={() => handleSignOff(item.id)}
                          disabled={isSignedOff}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSignedOff
                              ? "bg-[#4DE082]/20 text-[#4DE082] border border-[#4DE082]/40"
                              : "bg-[#182030] hover:bg-[#1E2638] text-slate-200 border border-[#1E2638]"
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          {isSignedOff ? "Signed Off" : "Quick Sign-off"}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReviewScan(item.patientId)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00F0FF]/10 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black border border-[#00F0FF]/30 font-semibold text-xs transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review Scan
                          </button>
                          <button
                            onClick={() => setSelectedHistory(item.patientId)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#1E2638] text-slate-300 font-semibold text-xs transition-all border border-[#1E2638]"
                          >
                            <History className="w-3.5 h-3.5" />
                            View History
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* AI Model Status Card */}
          <div className="p-5 rounded-2xl bg-[#111622]/80 border border-[#1E2638] space-y-4">
            <h3 className="font-bold text-white text-base">AI Model Status</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#1E2638]">
                <div>
                  <div className="font-semibold text-slate-200">ThoracicNet v3.2</div>
                  <div className="text-[10px] text-slate-400">Processing latency: 1.2s</div>
                </div>
                <span className="flex items-center gap-1 text-[#4DE082] font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DE082]" /> Online
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#1E2638]">
                <div>
                  <div className="font-semibold text-slate-200">NeuroScan Pro</div>
                  <div className="text-[10px] text-slate-400">Processing latency: 2.4s</div>
                </div>
                <span className="flex items-center gap-1 text-[#4DE082] font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DE082]" /> Online
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-slate-200">OrthoDetect X</div>
                  <div className="text-[10px] text-slate-400">Est. remaining: 4m 12s</div>
                </div>
                <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Updating
                </span>
              </div>
            </div>
          </div>

          {/* Throughput Trend Chart Card */}
          <div className="p-5 rounded-2xl bg-[#111622]/80 border border-[#1E2638]">
            <h3 className="font-bold text-white text-base">Throughput Trend</h3>
            <p className="text-xs text-slate-400 mb-4">Scans processed past 24h</p>
            
            <div className="h-28 flex items-end justify-between gap-2 pt-4">
              {[40, 65, 30, 85, 45, 100, 60, 40].map((height, i) => (
                <div key={i} className="flex-1 bg-[#182030] rounded-t-md relative group overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      i === 5 ? "bg-[#00F0FF]" : "bg-[#00F0FF]/30 group-hover:bg-[#00F0FF]/60"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span>00:00</span>
              <span>12:00</span>
              <span>Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: New Upload Dialog */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111622] border border-[#1E2638] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Upload New DICOM Scan</h3>
            <p className="text-xs text-slate-400 mb-4">Select or drop DICOM file for instant AI analysis.</p>

            <div 
              onClick={() => router.push("/scans")}
              className="border-2 border-dashed border-[#1E2638] hover:border-[#00F0FF] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#0B0F17]/50"
            >
              <UploadCloud className="w-10 h-10 text-[#00F0FF] mb-2" />
              <p className="text-sm font-semibold text-slate-200">Click to upload or Drag & Drop DICOM</p>
              <p className="text-xs text-slate-500 mt-1">Supports .DCM, .PNG, .JPG formats</p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#182030] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/scans")}
                className="px-4 py-2 rounded-xl bg-[#00F0FF] text-black text-xs font-bold"
              >
                Open Full Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Drawer / Modal: View History */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111622] border border-[#1E2638] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedHistory(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white">Audit History - Patient {selectedHistory}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Recent scan events and radiologist sign-offs.</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-[#1E2638]">
                <div className="font-semibold text-slate-200">Today, 10:14 AM</div>
                <div className="text-slate-400">Chest X-Ray analyzed by ThoracicNet v3.2</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-[#1E2638]">
                <div className="font-semibold text-slate-200">Oct 12, 2023</div>
                <div className="text-slate-400">Routine follow-up MRI - Baseline clear</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}