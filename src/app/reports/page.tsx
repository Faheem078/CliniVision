"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  Filter,
  HeartPulse,
  History,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ReportStatus = "CRITICAL" | "NORMAL";

type Patient = {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  mrn: string;
  dob: string;
  modality: string;
  confidence: number;
  status: ReportStatus;

  clinicalHistory: string;

  findings: {
    parenchyma: string;
    ventricles: string;
    vasculature: string;
  };

  impression: string;

  notes: string;

  lesionVolume: string;
  aspectsScore: number;

  accession: string;
  studyDate: string;
  seriesCount: number;
  imagesCount: number;

  studyDescription: string;
  aiModel: string;

  radiologist: string;
  licenseNumber: string;

  auditTrail: AuditEntry[];
};

type AuditEntry = {
  id: string;
  action: string;
  author: string;
  timestamp: string;
  details: string;
};

/* =========================================================
   DEFAULT RADIOLOGIST NOTES
========================================================= */

const DEFAULT_NOTES =
  "AI findings demonstrate a clinically significant abnormality. Correlate with the patient's current neurological or respiratory presentation and relevant laboratory findings.";

const COMPLIANCE_TEXT =
  "CONFIDENTIAL MEDICAL RECORD — Protected under HIPAA (45 CFR § 164) & GDPR Regulation (EU) 2016/679. Unauthorized disclosure or distribution is strictly prohibited.";

/* =========================================================
   PATIENT DATABASE
========================================================= */

const patientDB: Patient[] = [
  {
    id: "p-1001",
    name: "James R. Holden",
    age: 58,
    sex: "Male",
    mrn: "RAD-2026-1001",
    dob: "1968-04-18",
    modality: "MRI Brain w/wo Contrast",
    confidence: 98,
    status: "CRITICAL",

    clinicalHistory:
      "58-year-old male presenting with sudden onset left-sided weakness and expressive aphasia. Emergency stroke evaluation requested.",

    findings: {
      parenchyma:
        "Restricted diffusion involving the right MCA territory with associated cortical signal abnormality. Findings are concerning for acute ischemic change.",

      ventricles:
        "Ventricular system is within expected limits. No hydrocephalus or significant midline shift.",

      vasculature:
        "Reduced flow-related signal in the right MCA distribution. Further vascular correlation is recommended.",
    },

    impression:
      "Acute right MCA territory ischemic infarction. Urgent clinical and neurological correlation is recommended.",

    notes: DEFAULT_NOTES,

    lesionVolume: "32.4 cm³",
    aspectsScore: 6,

    accession: "ACC-2026-88421",
    studyDate: "2026-08-29 09:42",
    seriesCount: 8,
    imagesCount: 624,

    studyDescription: "MRI Brain Stroke Protocol",
    aiModel: "CliniVision Neuro v4.2",

    radiologist: "Dr. Sarah Chen",
    licenseNumber: "LICENSE-PENDING-VERIFICATION",

    auditTrail: [
      {
        id: "audit-1001",
        action: "AI Draft Generated",
        author: "CliniVision Neuro v4.2",
        timestamp: "2026-08-29 09:48",
        details:
          "Automated preliminary analysis completed.",
      },
      {
        id: "audit-1002",
        action: "Study Imported",
        author: "DICOM Bridge",
        timestamp: "2026-08-29 09:42",
        details:
          "624 images imported successfully.",
      },
    ],
  },

  {
    id: "p-1002",
    name: "Khan",
    age: 44,
    sex: "Male",
    mrn: "RAD-2026-1002",
    dob: "1982-01-09",
    modality: "CT Chest",
    confidence: 94,
    status: "CRITICAL",

    clinicalHistory:
      "Patient referred for persistent cough, fever, shortness of breath, and elevated inflammatory markers.",

    findings: {
      parenchyma:
        "Multifocal bilateral air-space opacities, most pronounced in the lower lobes. Pattern favors an infectious inflammatory process.",

      ventricles:
        "Not applicable for chest CT. No acute mediastinal abnormality identified.",

      vasculature:
        "No central pulmonary arterial filling defect identified on the provided examination.",
    },

    impression:
      "Multifocal bilateral pulmonary consolidation compatible with pneumonia. Clinical correlation and treatment follow-up recommended.",

    notes: DEFAULT_NOTES,

    lesionVolume: "48.7 cm³",
    aspectsScore: 10,

    accession: "ACC-2026-88319",
    studyDate: "2026-08-28 16:20",
    seriesCount: 6,
    imagesCount: 482,

    studyDescription: "CT Chest High Resolution",
    aiModel: "CliniVision Thorax v3.8",

    radiologist: "Dr. Sarah Chen",
    licenseNumber: "LICENSE-PENDING-VERIFICATION",

    auditTrail: [
      {
        id: "audit-2001",
        action: "AI Draft Generated",
        author: "CliniVision Thorax v3.8",
        timestamp: "2026-08-28 16:28",
        details:
          "Pulmonary abnormality detected.",
      },
    ],
  },

  {
    id: "p-1003",
    name: "Zainab Khan",
    age: 28,
    sex: "Female",
    mrn: "RAD-2026-1003",
    dob: "1998-03-03",
    modality: "MRI Brain w/wo Contrast",
    confidence: 99,
    status: "NORMAL",

    clinicalHistory:
      "Routine neurological evaluation. No acute neurological symptoms reported at the time of examination.",

    findings: {
      parenchyma:
        "Brain parenchymal signal and morphology are within normal limits. No focal mass, acute infarction, or abnormal enhancement identified.",

      ventricles:
        "Ventricular system is normal in size and configuration.",

      vasculature:
        "Major intracranial vascular flow voids are preserved.",
    },

    impression:
      "No acute intracranial abnormality identified.",

    notes:
      "No significant acute abnormality identified. Clinical correlation is recommended where appropriate.",

    lesionVolume: "0 cm³",
    aspectsScore: 10,

    accession: "ACC-2026-88110",
    studyDate: "2026-08-27 11:05",
    seriesCount: 7,
    imagesCount: 536,

    studyDescription: "MRI Brain Routine",
    aiModel: "CliniVision Neuro v4.2",

    radiologist: "Dr. Sarah Chen",
    licenseNumber: "LICENSE-PENDING-VERIFICATION",

    auditTrail: [
      {
        id: "audit-3001",
        action: "AI Draft Generated",
        author: "CliniVision Neuro v4.2",
        timestamp: "2026-08-27 11:14",
        details:
          "No significant abnormality detected.",
      },
    ],
  },

  {
    id: "p-1004",
    name: "Aamina Bibi",
    age: 54,
    sex: "Female",
    mrn: "RAD-2026-1004",
    dob: "1972-05-12",
    modality: "CT Chest",
    confidence: 96,
    status: "NORMAL",

    clinicalHistory:
      "Follow-up chest imaging following previous respiratory infection. Patient reports clinical improvement.",

    findings: {
      parenchyma:
        "Previously noted pulmonary opacities have resolved. No focal consolidation, pleural effusion, or pneumothorax.",

      ventricles:
        "Not applicable for chest CT.",

      vasculature:
        "Thoracic aorta and central pulmonary vasculature demonstrate no acute abnormality.",
    },

    impression:
      "No acute cardiopulmonary abnormality. Interval resolution of previously described pulmonary opacities.",

    notes:
      "Interval imaging demonstrates improvement. No acute cardiopulmonary abnormality identified on the current examination.",

    lesionVolume: "0 cm³",
    aspectsScore: 10,

    accession: "ACC-2026-87942",
    studyDate: "2026-08-26 14:32",
    seriesCount: 5,
    imagesCount: 394,

    studyDescription: "CT Chest Follow-up",
    aiModel: "CliniVision Thorax v3.8",

    radiologist: "Dr. Sarah Chen",
    licenseNumber: "LICENSE-PENDING-VERIFICATION",

    auditTrail: [
      {
        id: "audit-4001",
        action: "Study Imported",
        author: "DICOM Bridge",
        timestamp: "2026-08-26 14:32",
        details:
          "394 images imported successfully.",
      },
    ],
  },
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ReportsPage() {
  const [patients, setPatients] =
    useState<Patient[]>(patientDB);

  const [selectedPatientId, setSelectedPatientId] =
    useState<string>(patientDB[0].id);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "CRITICAL" | "NORMAL">(
      "ALL"
    );

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  const [notesEditMode, setNotesEditMode] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<
      "overview" | "comparison" | "audit"
    >("overview");

  const [clinicalHistory, setClinicalHistory] =
    useState(patientDB[0].clinicalHistory);

  const [parenchyma, setParenchyma] =
    useState(
      patientDB[0].findings.parenchyma
    );

  const [ventricles, setVentricles] =
    useState(
      patientDB[0].findings.ventricles
    );

  const [vasculature, setVasculature] =
    useState(
      patientDB[0].findings.vasculature
    );

  const [impression, setImpression] =
    useState(patientDB[0].impression);

  /* =======================================================
     DEDICATED RADIOLOGIST NOTES STATE
  ======================================================= */

  const [notes, setNotes] =
    useState<string>(
      patientDB[0].notes || DEFAULT_NOTES
    );

  const [isSyncing, setIsSyncing] =
    useState(false);

  const [isGeneratingPDF, setIsGeneratingPDF] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(null);

  /* =======================================================
     SELECTED PATIENT
  ======================================================= */

  const selectedPatient =
    patients.find(
      (patient) =>
        patient.id === selectedPatientId
    ) || patients[0];

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =======================================================
     SEARCH + STATUS FILTER
  ======================================================= */

  const filteredPatients = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        query.length === 0 ||
        patient.name
          .toLowerCase()
          .includes(query) ||
        patient.mrn
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        patient.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    patients,
    searchQuery,
    statusFilter,
  ]);

  /* =======================================================
     SELECT PATIENT
  ======================================================= */

  const handleSelectPatient = (
    patient: Patient
  ) => {
    setSelectedPatientId(patient.id);

    setClinicalHistory(
      patient.clinicalHistory
    );

    setParenchyma(
      patient.findings.parenchyma
    );

    setVentricles(
      patient.findings.ventricles
    );

    setVasculature(
      patient.findings.vasculature
    );

    setImpression(patient.impression);

    setNotes(
      patient.notes || DEFAULT_NOTES
    );

    setNotesEditMode(false);

    setEditMode(false);

    setSearchQuery("");

    setShowSearchResults(false);

    showToast(
      `Loaded report for ${patient.name}`
    );
  };

  /* =======================================================
     UPDATE SELECTED PATIENT
  ======================================================= */

  const updateSelectedPatient = (
    updates: Partial<Patient>
  ) => {
    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              ...updates,
            }
          : patient
      )
    );
  };

  /* =======================================================
     ADD AUDIT ENTRY
  ======================================================= */

  const addAuditEntry = (
    action: string,
    details: string
  ) => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      action,
      author: selectedPatient.radiologist,
      timestamp:
        new Date().toLocaleString(),
      details,
    };

    updateSelectedPatient({
      auditTrail: [
        entry,
        ...selectedPatient.auditTrail,
      ],
    });
  };

  /* =======================================================
     SAVE SECTION
  ======================================================= */

  const saveSection = (
    section: string
  ) => {
    updateSelectedPatient({
      clinicalHistory,
      findings: {
        parenchyma,
        ventricles,
        vasculature,
      },
      impression,
      notes,
    });

    addAuditEntry(
      "Report Section Updated",
      `${section} was saved to the active report draft.`
    );

    showToast(
      `${section} changes saved to draft.`
    );
  };

  /* =======================================================
     SAVE RADIOLOGIST NOTES
  ======================================================= */

  const saveRadiologistNotes = () => {
    updateSelectedPatient({
      notes,
    });

    addAuditEntry(
      "Radiologist Notes Updated",
      "Radiologist Notes were saved to the report draft."
    );

    setNotesEditMode(false);

    showToast(
      "Radiologist Notes Saved to Report"
    );
  };

  /* =======================================================
     SYNC DICOM BRIDGE
  ======================================================= */

  const handleSyncDicom = async () => {
    if (isSyncing) return;

    setIsSyncing(true);

    showToast(
      "Connecting to DICOM Bridge..."
    );

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 2000);
    });

    setIsSyncing(false);

    addAuditEntry(
      "DICOM Bridge Synchronized",
      `DICOM study ${selectedPatient.accession} synchronized successfully.`
    );

    showToast(
      "DICOM Bridge synchronized successfully."
    );
  };

  /* =======================================================
     DICOM VIEWER
  ======================================================= */

  const handleLaunchDicomViewer = () => {
    showToast(
      "Launching DICOM Viewer..."
    );
  };

  /* =======================================================
     GENERATE PDF
  ======================================================= */

  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    showToast(
      "Generating Structured PDF Report..."
    );

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1200);
    });

    const reportText = `
CLINIVISION CLINICAL DIAGNOSTIC REPORT
==========================================

PATIENT INFORMATION
------------------------------------------
Patient Name: ${selectedPatient.name}
Age: ${selectedPatient.age}
Sex: ${selectedPatient.sex}
MRN / Patient ID: ${selectedPatient.mrn}
Date of Birth: ${selectedPatient.dob}

DICOM STUDY
------------------------------------------
Modality: ${selectedPatient.modality}
Accession: ${selectedPatient.accession}
Study Date: ${selectedPatient.studyDate}
Series: ${selectedPatient.seriesCount}
Images: ${selectedPatient.imagesCount}

AI ANALYSIS
------------------------------------------
AI Model: ${selectedPatient.aiModel}
Confidence: ${selectedPatient.confidence}%
Status: ${selectedPatient.status}
Lesion Volume: ${selectedPatient.lesionVolume}
ASPECTS Score: ${selectedPatient.aspectsScore}/10

CLINICAL HISTORY
------------------------------------------
${clinicalHistory}

FINDINGS
------------------------------------------

Parenchyma:
${parenchyma}

Ventricles:
${ventricles}

Vasculature:
${vasculature}

RADIOLOGIST NOTES
------------------------------------------
${notes}

IMPRESSION / FINAL DIAGNOSIS
------------------------------------------
${impression}

DIGITAL SIGNATURE
------------------------------------------
Radiologist: ${selectedPatient.radiologist}
License: ${selectedPatient.licenseNumber}
Verification Status: Authenticated Provider Placeholder

SECURITY & COMPLIANCE
------------------------------------------
${COMPLIANCE_TEXT}

This report is an AI-assisted draft and requires
review by an appropriately licensed clinician
before clinical use.
`;

    try {
      const blob = new Blob(
        [reportText],
        {
          type: "text/plain;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        `CliniVision-${selectedPatient.mrn}-Report.txt`;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);

      addAuditEntry(
        "Structured Report Generated",
        "Structured report export was generated."
      );

      showToast(
        "Structured report generated successfully."
      );
    } catch {
      showToast(
        "Unable to generate the report."
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /* =======================================================
     SAVE RECORD
  ======================================================= */

  const handleSaveRecord = () => {
    updateSelectedPatient({
      clinicalHistory,
      findings: {
        parenchyma,
        ventricles,
        vasculature,
      },
      impression,
      notes,
    });

    addAuditEntry(
      "Record Saved",
      "Current clinical report state was saved to the patient file."
    );

    showToast(
      "Record Saved to Patient File"
    );
  };

  /* =======================================================
     APPROVE & SEND
  ======================================================= */

  const handleApproveAndSend = () => {
    updateSelectedPatient({
      clinicalHistory,
      findings: {
        parenchyma,
        ventricles,
        vasculature,
      },
      impression,
      notes,
    });

    addAuditEntry(
      "Report Approved & Sent",
      "Report finalized and sent to clinician."
    );

    setEditMode(false);
    setNotesEditMode(false);

    showToast(
      "Report Approved & Sent to Clinician"
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#070A11] text-slate-100">
      {/* ===================================================
          TOAST
      =================================================== */}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] flex max-w-sm items-center gap-3 rounded-xl border border-cyan-400/20 bg-[#0B121E] px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />

          <span className="text-xs font-semibold text-white">
            {toast}
          </span>
        </div>
      )}

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070A11]/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* BRAND */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-lg shadow-cyan-500/5">
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  CliniVision
                </span>

                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[8px] font-bold text-amber-300">
                  AI DRAFT
                </span>
              </div>

              <h1 className="mt-1 text-lg font-bold text-white">
                Clinical Report Workspace
              </h1>
            </div>
          </div>

          {/* SEARCH */}

          <div className="relative w-full xl:w-[430px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              value={searchQuery}
              onFocus={() =>
                setShowSearchResults(true)
              }
              onChange={(event) => {
                setSearchQuery(
                  event.target.value
                );

                setShowSearchResults(true);
              }}
              placeholder="Search patient name or MRN..."
              aria-label="Search patients"
              className="h-11 w-full rounded-xl border border-slate-800 bg-[#0B121E] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/10"
            />

            {/* SEARCH RESULTS */}

            {showSearchResults && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[200] overflow-hidden rounded-xl border border-slate-800 bg-[#0B121E] shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Matching Patient Records
                  </span>

                  <span className="font-mono text-[9px] text-cyan-300">
                    {filteredPatients.length}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {filteredPatients.map(
                    (patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() =>
                          handleSelectPatient(
                            patient
                          )
                        }
                        className="flex w-full items-center justify-between border-b border-slate-800/70 px-4 py-3 text-left transition hover:bg-slate-900"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">
                            {patient.name}
                          </p>

                          <p className="mt-1 font-mono text-[9px] text-slate-500">
                            {patient.mrn}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            {patient.modality}
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            patient.status
                          }
                        />
                      </button>
                    )
                  )}

                  {filteredPatients.length ===
                    0 && (
                    <div className="px-5 py-10 text-center">
                      <Search className="mx-auto h-5 w-5 text-slate-700" />

                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        No matching records found
                      </p>

                      <p className="mt-1 text-[9px] text-slate-600">
                        Try another patient name or MRN.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* FILTER */}

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as
                    | "ALL"
                    | "CRITICAL"
                    | "NORMAL"
                );

                setShowSearchResults(true);
              }}
              aria-label="Filter reports by anomaly status"
              className="h-10 rounded-xl border border-slate-800 bg-[#0B121E] px-3 text-[10px] font-bold text-slate-300 outline-none focus:border-cyan-400/50"
            >
              <option value="ALL">
                All Anomalies
              </option>

              <option value="CRITICAL">
                Critical Only
              </option>

              <option value="NORMAL">
                Normal Scans
              </option>
            </select>
          </div>
        </div>
      </header>

      {/* ===================================================
          PATIENT METADATA BANNER
      =================================================== */}

      <section className="border-b border-slate-800/80 bg-[#0B121E]/70 px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-7">
          <div className="rounded-xl border border-slate-800 bg-[#070A11]/70 p-4 xl:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={
                  selectedPatient.status
                }
              />

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[8px] font-bold text-amber-300">
                AI GENERATED DRAFT
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-white">
              {selectedPatient.name}
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              {selectedPatient.modality}
            </p>

            <p className="mt-2 font-mono text-[9px] text-slate-600">
              {selectedPatient.status ===
              "CRITICAL"
                ? "PENDING CRITICAL SIGN-OFF"
                : "PENDING CLINICAL SIGN-OFF"}
            </p>
          </div>

          <MetadataCard
            label="Age / Sex"
            value={`${selectedPatient.age} / ${selectedPatient.sex}`}
          />

          <MetadataCard
            label="MRN / Patient ID"
            value={selectedPatient.mrn}
            mono
          />

          <MetadataCard
            label="Date of Birth"
            value={selectedPatient.dob}
          />

          <MetadataCard
            label="Study Date"
            value={selectedPatient.studyDate}
          />

          <MetadataCard
            label="AI Confidence"
            value={`${selectedPatient.confidence}%`}
            accent
            mono
          />

          <div className="flex items-center">
            <button
              type="button"
              onClick={() =>
                setEditMode(
                  (current) => {
                    const next = !current;

                    if (next) {
                      setNotesEditMode(true);
                    }

                    return next;
                  }
                )
              }
              className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-[10px] font-bold transition ${
                editMode
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-400/30 hover:text-white"
              }`}
            >
              <Edit3 className="h-4 w-4" />

              {editMode
                ? "Editing"
                : "Edit Report"}
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          TABS
      =================================================== */}

      <nav className="border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto">
          <TabButton
            active={
              activeTab === "overview"
            }
            label="Report Workspace"
            icon={Activity}
            onClick={() =>
              setActiveTab("overview")
            }
          />

          <TabButton
            active={
              activeTab === "comparison"
            }
            label="Multi-Scan Comparison"
            icon={RefreshCw}
            onClick={() =>
              setActiveTab("comparison")
            }
          />

          <TabButton
            active={activeTab === "audit"}
            label="Audit Trail"
            icon={History}
            onClick={() =>
              setActiveTab("audit")
            }
          />
        </div>
      </nav>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="min-w-0 space-y-6">
              {/* CLINICAL HISTORY */}

              <ClinicalCard
                icon={ClipboardCheck}
                title="Clinical History"
                description="Symptoms, referral information and relevant clinical context."
                editMode={editMode}
              >
                <textarea
                  value={clinicalHistory}
                  disabled={!editMode}
                  onChange={(event) =>
                    setClinicalHistory(
                      event.target.value
                    )
                  }
                  rows={5}
                  className={textareaClass(
                    editMode
                  )}
                />

                {editMode && (
                  <CommitButton
                    onClick={() =>
                      saveSection(
                        "Clinical History"
                      )
                    }
                  />
                )}
              </ClinicalCard>

              {/* AI FINDINGS */}

              <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-4 shadow-xl shadow-black/10 sm:p-5">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                      <Brain className="h-4 w-4 text-cyan-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        AI Insights & Findings
                      </h3>

                      <p className="mt-1 text-[10px] text-slate-500">
                        AI-assisted imaging analysis requiring clinician review.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg border border-slate-800 bg-[#070A11] px-3 py-2 font-mono text-[9px] text-cyan-300">
                      {
                        selectedPatient.aiModel
                      }
                    </span>

                    <span className="rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-3 py-2 font-mono text-[9px] text-emerald-300">
                      {
                        selectedPatient.confidence
                      }
                      % CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* METRICS */}

                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Confidence Score"
                    value={`${selectedPatient.confidence}%`}
                    icon={Activity}
                    accent
                  />

                  <MetricCard
                    label="Lesion Volume"
                    value={
                      selectedPatient.lesionVolume
                    }
                    icon={HeartPulse}
                  />

                  <MetricCard
                    label="ASPECTS Score"
                    value={`${selectedPatient.aspectsScore}/10`}
                    icon={Brain}
                  />
                </div>

                {/* HEATMAP */}

                <div className="mt-4 rounded-2xl border border-slate-800 bg-[#070A11] p-4">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        AI Anomaly Heatmap
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        Visual placeholder for model-generated region-of-interest overlay.
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-lg px-2 py-1 text-[8px] font-bold ${
                        selectedPatient.status ===
                        "CRITICAL"
                          ? "bg-red-500/10 text-red-300"
                          : "bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {selectedPatient.status ===
                      "CRITICAL"
                        ? "ROI DETECTED"
                        : "NO SIGNIFICANT ROI"}
                    </span>
                  </div>

                  <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[radial-gradient(circle_at_center,#172333_0%,#070A11_65%)]">
                    <div className="absolute h-32 w-44 rounded-[45%] border border-cyan-400/20 bg-cyan-400/5" />

                    <div
                      className={`absolute h-20 w-28 rounded-full border-2 ${
                        selectedPatient.status ===
                        "CRITICAL"
                          ? "border-red-400/50 bg-red-500/10 shadow-[0_0_35px_rgba(239,68,68,0.18)]"
                          : "border-emerald-400/30 bg-emerald-500/5"
                      }`}
                    />

                    <div className="absolute h-28 w-40 rounded-[50%] border border-slate-500/20" />

                    <div className="relative z-10 text-center">
                      <Activity className="mx-auto h-8 w-8 text-cyan-400/40" />

                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        Imaging Preview
                      </p>
                    </div>
                  </div>
                </div>

                {/* FINDINGS */}

                <div className="mt-5 space-y-4">
                  <FindingEditor
                    title="Parenchyma"
                    value={parenchyma}
                    editMode={editMode}
                    onChange={
                      setParenchyma
                    }
                    onSave={() =>
                      saveSection(
                        "Parenchyma Findings"
                      )
                    }
                  />

                  <FindingEditor
                    title="Ventricles"
                    value={ventricles}
                    editMode={editMode}
                    onChange={
                      setVentricles
                    }
                    onSave={() =>
                      saveSection(
                        "Ventricular Findings"
                      )
                    }
                  />

                  <FindingEditor
                    title="Vasculature"
                    value={vasculature}
                    editMode={editMode}
                    onChange={
                      setVasculature
                    }
                    onSave={() =>
                      saveSection(
                        "Vascular Findings"
                      )
                    }
                  />
                </div>

                {/* TERMINOLOGY */}

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <TerminologyCard
                    label="RadLex"
                    code="RID4535"
                    description="Standardized radiology terminology mapping."
                  />

                  <TerminologyCard
                    label="SNOMED CT"
                    code="SCTID 233604007"
                    description="Structured clinical terminology mapping."
                  />
                </div>
              </section>

              {/* RADIOLOGIST NOTES */}

              <ClinicalCard
                icon={MessageSquare}
                title="Radiologist Notes"
                description="Clinical observations, differentials and recommendations."
                editMode={
                  editMode &&
                  notesEditMode
                }
              >
                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  disabled={
                    !editMode ||
                    !notesEditMode
                  }
                  rows={5}
                  className={
                    editMode &&
                    notesEditMode
                      ? "w-full resize-none rounded-xl border border-cyan-400 bg-slate-900 p-4 text-xs leading-5 text-white cursor-text focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
                      : "w-full resize-none rounded-xl border border-slate-800 bg-[#070A11]/70 p-4 text-xs leading-5 text-slate-400 cursor-not-allowed outline-none"
                  }
                />

                {editMode &&
                  notesEditMode && (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-400/70">
                        ENTER TO COMMIT
                      </span>

                      <button
                        type="button"
                        onClick={
                          saveRadiologistNotes
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 px-3 py-2 text-[9px] font-bold text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
                      >
                        <Check className="h-3.5 w-3.5" />
                        SAVE SECTION
                      </button>
                    </div>
                  )}
              </ClinicalCard>

              {/* IMPRESSION */}

              <section
                className={`rounded-2xl border p-5 ${
                  selectedPatient.status ===
                  "CRITICAL"
                    ? "border-red-400/20 bg-red-500/[0.04]"
                    : "border-emerald-400/20 bg-emerald-500/[0.04]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedPatient.status ===
                  "CRITICAL" ? (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Impression / Final Diagnosis
                        </h3>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Final structured clinical interpretation.
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-[9px] font-bold ${
                          selectedPatient.status ===
                          "CRITICAL"
                            ? "border-red-400/20 bg-red-500/10 text-red-300"
                            : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {selectedPatient.status}
                      </span>
                    </div>

                    <textarea
                      value={impression}
                      disabled={!editMode}
                      onChange={(event) =>
                        setImpression(
                          event.target.value
                        )
                      }
                      rows={5}
                      className={`mt-4 ${textareaClass(
                        editMode
                      )}`}
                    />

                    {editMode && (
                      <CommitButton
                        onClick={() =>
                          saveSection(
                            "Final Diagnosis"
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <aside className="space-y-5">
              {/* ACTIONS */}

              <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-4 shadow-xl">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Clinical Actions
                </p>

                <div className="space-y-2">
                  <ActionButton
                    icon={
                      isSyncing
                        ? Loader2
                        : RefreshCw
                    }
                    label={
                      isSyncing
                        ? "Syncing DICOM Bridge..."
                        : "Sync DICOM Bridge"
                    }
                    onClick={
                      handleSyncDicom
                    }
                    loading={isSyncing}
                  />

                  <ActionButton
                    icon={
                      isGeneratingPDF
                        ? Loader2
                        : Download
                    }
                    label={
                      isGeneratingPDF
                        ? "Generating PDF..."
                        : "Generate PDF"
                    }
                    onClick={
                      handleGeneratePDF
                    }
                    loading={
                      isGeneratingPDF
                    }
                  />

                  <ActionButton
                    icon={Save}
                    label="Save Record"
                    onClick={
                      handleSaveRecord
                    }
                  />

                  <button
                    type="button"
                    onClick={
                      handleApproveAndSend
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-[10px] font-bold text-black shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-[0.98]"
                  >
                    <Send className="h-4 w-4" />

                    Approve & Send
                  </button>
                </div>
              </section>

              {/* =================================================
                  DYNAMIC DICOM STUDY
              ================================================= */}

              <button
                type="button"
                onClick={
                  handleLaunchDicomViewer
                }
                className="group w-full rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-5 text-left transition hover:border-cyan-400/30 hover:bg-[#0D1623] hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-cyan-400" />

                    <h3 className="text-sm font-bold text-white">
                      DICOM Study
                    </h3>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                </div>

                <div className="space-y-3">
                  <DetailRow
                    label="Modality"
                    value={
                      selectedPatient.modality
                    }
                  />

                  <DetailRow
                    label="Accession"
                    value={
                      selectedPatient.accession
                    }
                    mono
                  />

                  <DetailRow
                    label="Study Date"
                    value={
                      selectedPatient.studyDate
                    }
                    mono
                  />

                  <DetailRow
                    label="Series"
                    value={String(
                      selectedPatient.seriesCount
                    )}
                  />

                  <DetailRow
                    label="Images"
                    value={String(
                      selectedPatient.imagesCount
                    )}
                  />
                </div>

                <div className="mt-4 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-cyan-400/70">
                    Click to launch viewer
                  </p>
                </div>
              </button>

              {/* DIGITAL SIGNATURE */}

              <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white">
                      Digital Signature
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Authenticated radiologist signature block.
                    </p>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-200">
                        {
                          selectedPatient.radiologist
                        }
                      </p>

                      <p className="mt-1 text-[9px] text-slate-600">
                        Head Radiologist
                      </p>

                      <p className="mt-3 break-all font-mono text-[8px] text-slate-600">
                        License:{" "}
                        {
                          selectedPatient.licenseNumber
                        }
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-3 py-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

                      <span className="text-[8px] font-bold text-emerald-300">
                        Verification Placeholder
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* COMPLIANCE */}

              <section className="rounded-2xl border border-slate-800 bg-[#070A11] p-4">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Security & Compliance
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-slate-600">
                      {COMPLIANCE_TEXT}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}

        {/* =================================================
            MULTI SCAN COMPARISON
        ================================================= */}

        {activeTab ===
          "comparison" && (
          <ComparisonView
            selectedPatient={
              selectedPatient
            }
            patients={patients}
          />
        )}

        {/* =================================================
            AUDIT TRAIL
        ================================================= */}

        {activeTab === "audit" && (
          <AuditView
            patient={selectedPatient}
          />
        )}
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-slate-800 bg-[#070A11] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Confidential Medical Record
              </p>

              <p className="mt-2 max-w-5xl text-[9px] leading-5 text-slate-600">
                {COMPLIANCE_TEXT}
              </p>
            </div>
          </div>

          <div className="font-mono text-[9px] text-slate-700">
            CLINIVISION · CLINICAL REPORTING
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   METADATA CARD
========================================================= */

function MetadataCard({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#070A11]/70 p-3">
      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-[10px] font-semibold ${
          accent
            ? "text-cyan-400"
            : "text-slate-300"
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: ReportStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-bold ${
        status === "CRITICAL"
          ? "border-red-400/20 bg-red-500/10 text-red-300"
          : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status}
    </span>
  );
}

/* =========================================================
   TAB BUTTON
========================================================= */

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex shrink-0 items-center gap-2 border-b-2 px-1 py-4 text-[10px] font-bold transition ${
        active
          ? "border-cyan-400 text-cyan-400"
          : "border-transparent text-slate-500 hover:text-white"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />

      {label}
    </button>
  );
}

/* =========================================================
   CLINICAL CARD
========================================================= */

function ClinicalCard({
  icon: Icon,
  title,
  description,
  editMode,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  editMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
            <Icon className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white">
              {title}
            </h3>

            <p className="mt-1 text-[10px] text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {editMode && (
          <span className="shrink-0 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[8px] font-bold text-cyan-300">
            EDIT MODE
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   COMMIT BUTTON
========================================================= */

function CommitButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-400/60 sm:mr-auto">
        ENTER TO COMMIT
      </span>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 px-3 py-2 text-[9px] font-bold text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
      >
        <Check className="h-3.5 w-3.5" />

        SAVE SECTION
      </button>
    </div>
  );
}

/* =========================================================
   FINDING EDITOR
========================================================= */

function FindingEditor({
  title,
  value,
  editMode,
  onChange,
  onSave,
}: {
  title: string;
  value: string;
  editMode: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#070A11] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        {editMode && (
          <span className="hidden font-mono text-[8px] text-cyan-400 sm:block">
            ENTER TO COMMIT
          </span>
        )}
      </div>

      <textarea
        value={value}
        disabled={!editMode}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
        className={textareaClass(
          editMode
        )}
      />

      {editMode && (
        <CommitButton
          onClick={onSave}
        />
      )}
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#070A11] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <Icon
          className={`h-4 w-4 ${
            accent
              ? "text-cyan-400"
              : "text-slate-600"
          }`}
        />
      </div>

      <p
        className={`mt-3 break-words font-mono text-xl font-bold ${
          accent
            ? "text-cyan-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TERMINOLOGY CARD
========================================================= */

function TerminologyCard({
  label,
  code,
  description,
}: {
  label: string;
  code: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#070A11] p-4">
      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-2 font-mono text-xs font-bold text-cyan-300">
        {code}
      </p>

      <p className="mt-2 text-[9px] leading-4 text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  loading = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 text-[10px] font-bold text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          className={`h-4 w-4 shrink-0 ${
            loading
              ? "animate-spin text-cyan-400"
              : "text-cyan-300"
          }`}
        />

        <span className="truncate">
          {label}
        </span>
      </span>

      {!loading && (
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      )}
    </button>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-[9px] text-slate-600">
        {label}
      </span>

      <span
        className={`break-words text-right text-[9px] font-semibold text-slate-300 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   COMPARISON VIEW
========================================================= */

function ComparisonView({
  selectedPatient,
  patients,
}: {
  selectedPatient: Patient;
  patients: Patient[];
}) {
  const historicalPatients =
    patients.filter(
      (patient) =>
        patient.id !== selectedPatient.id
    );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                <RefreshCw className="h-4 w-4 text-cyan-400" />
              </div>

              <div>
                <h2 className="text-base font-bold text-white">
                  Multi-Scan Comparison
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Longitudinal comparison of current and historical study metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#070A11] px-3 py-2">
            <span className="text-[8px] text-slate-600">
              CURRENT STUDY
            </span>

            <p className="mt-1 font-mono text-[9px] text-cyan-300">
              {selectedPatient.accession}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ComparisonCard
          title="Current Study"
          patient={selectedPatient}
          current
        />

        <div className="space-y-5">
          {historicalPatients
            .slice(0, 2)
            .map((patient) => (
              <ComparisonCard
                key={patient.id}
                title="Historical / Related Study"
                patient={patient}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPARISON CARD
========================================================= */

function ComparisonCard({
  title,
  patient,
  current = false,
}: {
  title: string;
  patient: Patient;
  current?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border p-5 ${
        current
          ? "border-cyan-400/20 bg-cyan-400/[0.03]"
          : "border-slate-800 bg-[#0B121E]"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
            {title}
          </p>

          <h3 className="mt-1 truncate text-sm font-bold text-white">
            {patient.name}
          </h3>

          <p className="mt-1 font-mono text-[8px] text-slate-600">
            {patient.studyDate}
          </p>
        </div>

        <StatusBadge
          status={patient.status}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Confidence"
          value={`${patient.confidence}%`}
          icon={Activity}
          accent={current}
        />

        <MetricCard
          label="Lesion Volume"
          value={patient.lesionVolume}
          icon={HeartPulse}
        />

        <MetricCard
          label="ASPECTS"
          value={`${patient.aspectsScore}/10`}
          icon={Brain}
        />

        <MetricCard
          label="Images"
          value={String(
            patient.imagesCount
          )}
          icon={FileCheck2}
        />
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-[#070A11] p-4">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
          Impression
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-300">
          {patient.impression}
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   AUDIT VIEW
========================================================= */

function AuditView({
  patient,
}: {
  patient: Patient;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
            <History className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-base font-bold text-white">
              Audit Trail
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Timestamped report edits, authorship and compliance modification events.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#0B121E]/90 p-5">
        {patient.auditTrail.length ===
        0 ? (
          <div className="py-12 text-center">
            <History className="mx-auto h-6 w-6 text-slate-700" />

            <p className="mt-3 text-xs text-slate-500">
              No audit events recorded.
            </p>
          </div>
        ) : (
          <div className="relative space-y-5">
            {patient.auditTrail.map(
              (entry, index) => (
                <div
                  key={entry.id}
                  className="relative flex gap-4"
                >
                  {index !==
                    patient.auditTrail.length -
                      1 && (
                    <div className="absolute left-[7px] top-5 h-full w-px bg-slate-800" />
                  )}

                  <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border border-cyan-400/40 bg-[#070A11]" />

                  <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#070A11] p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="text-xs font-bold text-white">
                        {entry.action}
                      </p>

                      <span className="font-mono text-[8px] text-slate-600">
                        {entry.timestamp}
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] font-semibold text-cyan-300">
                      {entry.author}
                    </p>

                    <p className="mt-2 text-[10px] leading-5 text-slate-500">
                      {entry.details}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#070A11] p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

          <div>
            <p className="text-xs font-bold text-white">
              Compliance Modification Log
            </p>

            <p className="mt-2 text-[10px] leading-5 text-slate-600">
              Production deployments should persist audit events using immutable server-side logging tied to authenticated user identities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   TEXTAREA STYLE
========================================================= */

function textareaClass(
  editable: boolean
) {
  if (editable) {
    return "w-full resize-none rounded-xl border border-cyan-400 bg-slate-900 p-4 text-xs leading-5 text-white cursor-text focus:outline-none focus:ring-1 focus:ring-cyan-400/20";
  }

  return "w-full resize-none rounded-xl border border-slate-800 bg-[#070A11]/70 p-4 text-xs leading-5 text-slate-400 cursor-not-allowed outline-none";
}