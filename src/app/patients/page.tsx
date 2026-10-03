"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit3,
  FileCheck,
  FileText,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Gender = "Male" | "Female" | "Other";

type Impression =
  | "Normal"
  | "Abnormal"
  | "Critical / Immediate Action Required";

type PatientFilter = "all" | "linked" | "critical";

interface DiagnosticFinding {
  name: string;
  confidence: number;
  radlexCode: string;
  radlexLabel: string;
  snomedCode: string;
  snomedLabel: string;
}

export interface LinkedDiagnosticReport {
  id: string;
  clinicalHistory: string;
  finding: DiagnosticFinding;
  ctr: string;
  lungVolume: string;
  radiologistNotes: string;
  impression: Impression;
  finalDiagnosis: string;
  radiologistName: string;
  radiologistRole: string;
  licenseNumber: string;
  signedAt: string;
  isFinalized: boolean;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: number | "";
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  email: string;
  createdAt: string;
  diagnosticReport?: LinkedDiagnosticReport;
}

/* =========================================================
   CONSTANTS
========================================================= */

const PATIENT_STORAGE_KEY = "clinivision-patients-v1";
const REPORT_STORAGE_KEY = "clinivision-reports-v1";
const REPORTS_UPDATED_EVENT = "clinivision-reports-updated";

const RADIOLOGIST_NAME = "Dr. Sarah Chen";
const RADIOLOGIST_ROLE = "Head Radiologist";

/*
 * Do not use a fake real-world medical license number.
 * Connect this value to the authenticated provider profile
 * in the production backend.
 */
const LICENSE_NUMBER = "LICENSE-PENDING-VERIFICATION";

const COMPLIANCE_TEXT =
  "CONFIDENTIAL MEDICAL RECORD — Protected under HIPAA (45 CFR § 164) & GDPR Regulation (EU) 2016/679. Unauthorized disclosure or distribution is strictly prohibited. Electronically signed by licensed radiologist.";

/* =========================================================
   TERMINOLOGY
========================================================= */

const FINDING_TERMINOLOGY: Record<
  string,
  Omit<DiagnosticFinding, "confidence">
> = {
  "Pneumonia Focus": {
    name: "Pneumonia Focus",
    radlexCode: "RID4535",
    radlexLabel: "Pulmonary consolidation",
    snomedCode: "233604007",
    snomedLabel: "Pneumonia",
  },

  "Pleural Effusion": {
    name: "Pleural Effusion",
    radlexCode: "RID3876",
    radlexLabel: "Pleural effusion",
    snomedCode: "60046008",
    snomedLabel: "Pleural effusion",
  },

  Cardiomegaly: {
    name: "Cardiomegaly",
    radlexCode: "RID1309",
    radlexLabel: "Cardiomegaly",
    snomedCode: "8186001",
    snomedLabel: "Cardiomegaly",
  },

  "Bone Fracture": {
    name: "Bone Fracture",
    radlexCode: "RID5032",
    radlexLabel: "Fracture",
    snomedCode: "72704001",
    snomedLabel: "Fracture",
  },

  Tuberculosis: {
    name: "Tuberculosis",
    radlexCode: "RID4908",
    radlexLabel: "Pulmonary tuberculosis",
    snomedCode: "56717001",
    snomedLabel: "Tuberculosis",
  },

  Normal: {
    name: "No acute abnormality detected",
    radlexCode: "UNMAPPED",
    radlexLabel: "No acute radiographic abnormality",
    snomedCode: "UNMAPPED",
    snomedLabel: "No abnormality detected",
  },
};

const FINDING_OPTIONS = [
  "Pneumonia Focus",
  "Pleural Effusion",
  "Cardiomegaly",
  "Bone Fracture",
  "Tuberculosis",
  "Normal",
];

/* =========================================================
   HELPERS
========================================================= */

function getTerminology(
  finding: string,
  confidence: number
): DiagnosticFinding {
  const mapped = FINDING_TERMINOLOGY[finding];

  if (mapped) {
    return {
      ...mapped,
      confidence,
    };
  }

  return {
    name: finding,
    confidence,
    radlexCode: "UNMAPPED",
    radlexLabel: finding,
    snomedCode: "UNMAPPED",
    snomedLabel: finding,
  };
}

function readPatients(): PatientRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(
      PATIENT_STORAGE_KEY
    );

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePatients(
  patients: PatientRecord[]
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PATIENT_STORAGE_KEY,
    JSON.stringify(patients)
  );
}

function readReports(): any[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(
      REPORT_STORAGE_KEY
    );

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReports(reports: any[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    REPORT_STORAGE_KEY,
    JSON.stringify(reports)
  );

  window.dispatchEvent(
    new Event(REPORTS_UPDATED_EVENT)
  );
}

/* =========================================================
   PDF HELPERS
========================================================= */

function pdfSafe(value: unknown) {
  return String(value ?? "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapPdfText(
  text: string,
  max = 86
) {
  const words = String(text || "").split(/\s+/);

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    const next = `${current} ${word}`;

    if (next.length <= max) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function createPatientPdf(
  patient: PatientRecord
) {
  const report = patient.diagnosticReport;

  const lines: string[] = [
    "CLINIVISION CLINICAL DIAGNOSTIC REPORT",
    "============================================================",
    "",
    "PATIENT INFORMATION",
    "------------------------------------------------------------",
    `Patient Name: ${patient.name}`,
    `Patient ID: ${patient.patientId}`,
    `Age: ${patient.age}`,
    `Gender: ${patient.gender}`,
    `Date of Birth: ${
      patient.dateOfBirth || "Not provided"
    }`,
    `Contact: ${
      patient.phone || "Not provided"
    }`,
    `Email: ${
      patient.email || "Not provided"
    }`,
    "",
  ];

  if (!report) {
    lines.push(
      "DIAGNOSTIC REPORT",
      "------------------------------------------------------------",
      "No linked diagnostic report is currently attached.",
      "",
      "SECURITY & COMPLIANCE",
      "------------------------------------------------------------",
      COMPLIANCE_TEXT,
      "",
      `Radiologist: ${RADIOLOGIST_NAME}`,
      `Role: ${RADIOLOGIST_ROLE}`,
      `License: ${LICENSE_NUMBER}`,
      `Verification Timestamp: ${new Date().toLocaleString()}`
    );
  } else {
    lines.push(
      "LINKED DIAGNOSTIC REPORT",
      "------------------------------------------------------------",
      `Report ID: ${report.id}`,
      "",
      "CLINICAL HISTORY",
      "------------------------------------------------------------",
      ...wrapPdfText(
        report.clinicalHistory ||
          "No clinical history provided."
      ),
      "",
      "AI FINDINGS & ANOMALY DETECTION",
      "------------------------------------------------------------",
      `Finding: ${report.finding.name}`,
      `AI Confidence: ${report.finding.confidence}%`,
      `RadLex: ${report.finding.radlexCode} - ${report.finding.radlexLabel}`,
      `SNOMED CT: ${report.finding.snomedCode} - ${report.finding.snomedLabel}`,
      "",
      "IMAGING METRICS",
      "------------------------------------------------------------",
      `CTR Ratio: ${
        report.ctr || "Not measured"
      }`,
      `Lung Volume: ${
        report.lungVolume || "Not measured"
      }`,
      "",
      "RADIOLOGIST CLINICAL NOTES",
      "------------------------------------------------------------",
      ...wrapPdfText(
        report.radiologistNotes ||
          "No radiologist notes provided."
      ),
      "",
      "IMPRESSION / DIAGNOSIS",
      "------------------------------------------------------------",
      `Category: ${report.impression}`,
      ...wrapPdfText(
        report.finalDiagnosis ||
          "No final diagnosis summary provided."
      ),
      "",
      "DIGITAL SIGNATURE VERIFICATION",
      "------------------------------------------------------------",
      `Radiologist: ${report.radiologistName}`,
      `Role: ${report.radiologistRole}`,
      `License Number: ${report.licenseNumber}`,
      `Verification Timestamp: ${report.signedAt}`,
      "",
      "SECURITY & COMPLIANCE",
      "------------------------------------------------------------",
      COMPLIANCE_TEXT
    );
  }

  const commands = [
    "BT",
    "/F1 9 Tf",
    "50 750 Td",
    "13 TL",
  ];

  lines.forEach((line, index) => {
    if (index === 0) {
      commands.push(
        `/F1 16 Tf (${pdfSafe(line)}) Tj`
      );
      commands.push("/F1 9 Tf");
    } else {
      commands.push(
        `T* (${pdfSafe(line)}) Tj`
      );
    }
  });

  commands.push("ET");

  const content = commands.join("\n");

  const encoder = new TextEncoder();

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",

    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",

    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",

    `<< /Length ${
      encoder.encode(content).length
    } >>
stream
${content}
endstream`,

    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf =
    "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";

  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    offsets[index + 1] =
      encoder.encode(pdf).length;

    pdf += `${index + 1} 0 obj\n`;
    pdf += `${object}\n`;
    pdf += "endobj\n";
  });

  const xrefOffset =
    encoder.encode(pdf).length;

  pdf += `xref\n0 ${
    objects.length + 1
  }\n`;

  pdf +=
    "0000000000 65535 f \n";

  for (
    let i = 1;
    i <= objects.length;
    i++
  ) {
    pdf += `${String(
      offsets[i]
    ).padStart(
      10,
      "0"
    )} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\n`;

  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], {
    type: "application/pdf",
  });
}

/* =========================================================
   SAMPLE DATA
========================================================= */

const initialPatients: PatientRecord[] = [
  {
    id: "patient-9102",
    patientId: "RAD-2026-9102",
    name: "Aamina Bibi",
    age: 54,
    gender: "Female",
    dateOfBirth: "1972-05-12",
    phone: "",
    email: "",
    createdAt: "2026-08-20",
    diagnosticReport: {
      id: "RPT-9102",
      clinicalHistory:
        "Patient referred for persistent cough and fever.",
      finding: getTerminology(
        "Pneumonia Focus",
        94
      ),
      ctr: "0.48",
      lungVolume: "6.2L",
      radiologistNotes:
        "Right upper-lobe consolidation identified. Clinical correlation recommended.",
      impression: "Abnormal",
      finalDiagnosis:
        "Findings are compatible with pneumonia.",
      radiologistName: RADIOLOGIST_NAME,
      radiologistRole: RADIOLOGIST_ROLE,
      licenseNumber: LICENSE_NUMBER,
      signedAt: "2026-08-20 14:32",
      isFinalized: true,
    },
  },

  {
    id: "patient-9101",
    patientId: "RAD-2026-9101",
    name: "Muhammad Ali",
    age: 31,
    gender: "Male",
    dateOfBirth: "1995-02-19",
    phone: "",
    email: "",
    createdAt: "2026-08-19",
    diagnosticReport: {
      id: "RPT-9101",
      clinicalHistory:
        "Trauma assessment following reported injury.",
      finding: getTerminology(
        "Bone Fracture",
        98
      ),
      ctr: "0.42",
      lungVolume: "5.8L",
      radiologistNotes:
        "Fracture pattern requires correlation with clinical examination.",
      impression: "Abnormal",
      finalDiagnosis:
        "Fracture identified on imaging.",
      radiologistName: RADIOLOGIST_NAME,
      radiologistRole: RADIOLOGIST_ROLE,
      licenseNumber: LICENSE_NUMBER,
      signedAt: "2026-08-19 11:21",
      isFinalized: false,
    },
  },

  {
    id: "patient-9100",
    patientId: "RAD-2026-9100",
    name: "Zainab Khan",
    age: 28,
    gender: "Female",
    dateOfBirth: "1998-03-03",
    phone: "",
    email: "",
    createdAt: "2026-08-18",
    diagnosticReport: {
      id: "RPT-9100",
      clinicalHistory:
        "Routine chest imaging.",
      finding: getTerminology(
        "Normal",
        99
      ),
      ctr: "0.45",
      lungVolume: "6.0L",
      radiologistNotes:
        "No acute cardiopulmonary abnormality identified.",
      impression: "Normal",
      finalDiagnosis:
        "No acute abnormality detected.",
      radiologistName: RADIOLOGIST_NAME,
      radiologistRole: RADIOLOGIST_ROLE,
      licenseNumber: LICENSE_NUMBER,
      signedAt: "2026-08-18 09:14",
      isFinalized: true,
    },
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function PatientsPage() {
  const [patients, setPatients] =
    useState<PatientRecord[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  /*
   * =======================================================
   * ACTIVE METRIC FILTER
   * =======================================================
   */

  const [activeFilter, setActiveFilter] =
    useState<PatientFilter>("all");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState<PatientRecord | null>(null);

  const [editingPatient, setEditingPatient] =
    useState<PatientRecord | null>(null);

  const [activeTab, setActiveTab] =
    useState<"patient" | "report">(
      "patient"
    );

  const [isGeneratingPDF, setIsGeneratingPDF] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [patientName, setPatientName] =
    useState("");

  const [age, setAge] =
    useState<string>("");

  const [gender, setGender] =
    useState<Gender>("Male");

  const [patientId, setPatientId] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [clinicalHistory, setClinicalHistory] =
    useState("");

  const [findingName, setFindingName] =
    useState("Pneumonia Focus");

  const [confidence, setConfidence] =
    useState(94);

  const [ctr, setCtr] =
    useState("");

  const [lungVolume, setLungVolume] =
    useState("");

  const [radiologistNotes, setRadiologistNotes] =
    useState("");

  const [impression, setImpression] =
    useState<Impression>("Abnormal");

  const [finalDiagnosis, setFinalDiagnosis] =
    useState("");

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);

      window.setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    },
    []
  );

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const stored = readPatients();

    if (stored.length) {
      setPatients(stored);
    } else {
      setPatients(initialPatients);
      savePatients(initialPatients);
    }
  }, []);

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setEditingPatient(null);

    setPatientName("");
    setAge("");
    setGender("Male");
    setPatientId("");
    setDateOfBirth("");
    setPhone("");
    setEmail("");

    setClinicalHistory("");

    setFindingName("Pneumonia Focus");

    setConfidence(94);

    setCtr("");
    setLungVolume("");

    setRadiologistNotes(
      "AI-assisted findings require radiologist review and clinical correlation."
    );

    setImpression("Abnormal");

    setFinalDiagnosis("");
  };

  /* =======================================================
     GENERATE PATIENT ID
  ======================================================= */

  const generatePatientId = () => {
    let generated = "";

    do {
      generated = `RAD-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
    } while (
      patients.some(
        (patient) =>
          patient.patientId === generated
      )
    );

    return generated;
  };

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  const openAddPatient = () => {
    resetForm();

    setPatientId(
      generatePatientId()
    );

    setActiveTab("patient");

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT EXISTING PATIENT
  ======================================================= */

  const openEditPatient = (
    patient: PatientRecord
  ) => {
    setEditingPatient(patient);

    setPatientName(patient.name);

    setAge(
      patient.age === ""
        ? ""
        : String(patient.age)
    );

    setGender(patient.gender);

    setPatientId(
      patient.patientId
    );

    setDateOfBirth(
      patient.dateOfBirth
    );

    setPhone(patient.phone);
    setEmail(patient.email);

    const report =
      patient.diagnosticReport;

    if (report) {
      setClinicalHistory(
        report.clinicalHistory
      );

      /*
       * Convert the stored finding back to
       * the select option where possible.
       */
      const matchedFinding =
        FINDING_OPTIONS.find(
          (option) =>
            option ===
            report.finding.name
        );

      setFindingName(
        matchedFinding ||
          report.finding.name
      );

      setConfidence(
        report.finding.confidence
      );

      setCtr(report.ctr);

      setLungVolume(
        report.lungVolume
      );

      setRadiologistNotes(
        report.radiologistNotes
      );

      setImpression(
        report.impression
      );

      setFinalDiagnosis(
        report.finalDiagnosis
      );
    } else {
      setClinicalHistory("");

      setFindingName(
        "Pneumonia Focus"
      );

      setConfidence(94);

      setCtr("");
      setLungVolume("");

      setRadiologistNotes("");

      setImpression("Abnormal");

      setFinalDiagnosis("");
    }

    setActiveTab(
      report
        ? "report"
        : "patient"
    );

    setIsModalOpen(true);
  };

  /* =======================================================
     SAVE PATIENT + REPORT
  ======================================================= */

  const handleSavePatient = (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!patientName.trim()) {
      showToast(
        "Patient name is required."
      );
      return;
    }

    if (!patientId.trim()) {
      showToast(
        "Patient ID is required."
      );
      return;
    }

    if (!age) {
      showToast(
        "Patient age is required."
      );
      return;
    }

    const terminology =
      getTerminology(
        findingName,
        confidence
      );

    const now =
      new Date().toLocaleString();

    const report: LinkedDiagnosticReport =
      {
        id:
          editingPatient?.diagnosticReport
            ?.id ||
          `RPT-${Date.now()}`,

        clinicalHistory:
          clinicalHistory.trim(),

        finding: terminology,

        ctr:
          ctr.trim() ||
          "Not measured",

        lungVolume:
          lungVolume.trim() ||
          "Not measured",

        radiologistNotes:
          radiologistNotes.trim(),

        impression,

        finalDiagnosis:
          finalDiagnosis.trim() ||
          `${impression}: ${findingName}`,

        radiologistName:
          RADIOLOGIST_NAME,

        radiologistRole:
          RADIOLOGIST_ROLE,

        licenseNumber:
          LICENSE_NUMBER,

        signedAt: now,

        isFinalized:
          editingPatient
            ?.diagnosticReport
            ?.isFinalized || false,
      };

    const patient: PatientRecord =
      {
        id:
          editingPatient?.id ||
          `patient-${Date.now()}`,

        patientId:
          patientId.trim(),

        name:
          patientName.trim(),

        age: Number(age),

        gender,

        dateOfBirth,

        phone,

        email,

        createdAt:
          editingPatient?.createdAt ||
          now,

        diagnosticReport:
          report,
      };

    const nextPatients =
      editingPatient
        ? patients.map((item) =>
            item.id ===
            editingPatient.id
              ? patient
              : item
          )
        : [
            patient,
            ...patients,
          ];

    setPatients(nextPatients);

    savePatients(nextPatients);

    /* =====================================================
       SYNCHRONIZE REPORTS MODULE
    ===================================================== */

    const existingReports =
      readReports();

    const reportForReports = {
      ...report,

      patientName:
        patient.name,

      patientId:
        patient.patientId,

      age:
        String(patient.age),

      gender:
        patient.gender,

      scanDate:
        patient.dateOfBirth ||
        now,

      createdAt:
        now,
    };

    const nextReports =
      existingReports.some(
        (item) =>
          item.id === report.id
      )
        ? existingReports.map(
            (item) =>
              item.id === report.id
                ? reportForReports
                : item
          )
        : [
            reportForReports,
            ...existingReports,
          ];

    saveReports(nextReports);

    setSelectedPatient(patient);

    setIsModalOpen(false);

    showToast(
      editingPatient
        ? `Patient record ${patient.patientId} updated successfully.`
        : `Patient record ${patient.patientId} created and diagnostic report attached successfully.`
    );
  };

  /* =======================================================
     GENERATE PDF
  ======================================================= */

  const handleGeneratePDF =
    useCallback(
      async (
        patient: PatientRecord
      ) => {
        if (isGeneratingPDF) {
          return;
        }

        setIsGeneratingPDF(true);

        try {
          await new Promise<void>(
            (resolve) =>
              window.setTimeout(
                resolve,
                1500
              )
          );

          const blob =
            createPatientPdf(
              patient
            );

          const url =
            URL.createObjectURL(
              blob
            );

          const anchor =
            document.createElement(
              "a"
            );

          anchor.href = url;

          anchor.download =
            `CliniVision-Diagnosis-${patient.patientId}.pdf`;

          document.body.appendChild(
            anchor
          );

          anchor.click();

          anchor.remove();

          window.setTimeout(() => {
            URL.revokeObjectURL(
              url
            );
          }, 1000);

          showToast(
            `Diagnosis PDF for ${patient.name} generated and saved to patient record.`
          );
        } catch {
          showToast(
            "Unable to generate diagnosis PDF."
          );
        } finally {
          setIsGeneratingPDF(false);
        }
      },
      [
        isGeneratingPDF,
        showToast,
      ]
    );

  /* =======================================================
     CRITICAL CHECK
  ======================================================= */

  const isCriticalPatient =
    useCallback(
      (patient: PatientRecord) => {
        const report =
          patient.diagnosticReport;

        if (!report) {
          return false;
        }

        const impression =
          report.impression
            .toLowerCase();

        const finding =
          report.finding.name
            .toLowerCase();

        const diagnosis =
          report.finalDiagnosis
            .toLowerCase();

        return (
          impression.includes(
            "critical"
          ) ||
          impression.includes(
            "abnormal"
          ) ||
          impression.includes(
            "urgent"
          ) ||
          impression.includes(
            "immediate"
          ) ||
          finding.includes(
            "critical"
          ) ||
          finding.includes(
            "urgent"
          ) ||
          diagnosis.includes(
            "critical"
          ) ||
          diagnosis.includes(
            "urgent"
          )
        );
      },
      []
    );

  /* =======================================================
     SUMMARY COUNTS
  ======================================================= */

  const totalPatients =
    patients.length;

  const linkedReports =
    patients.filter(
      (patient) =>
        !!patient.diagnosticReport
    ).length;

  const criticalReports =
    patients.filter(
      (patient) =>
        isCriticalPatient(patient)
    ).length;

  /* =======================================================
     FILTER + SEARCH
  ======================================================= */

  const filteredPatients =
    useMemo(() => {
      let result =
        [...patients];

      /* -----------------------------------------------
         METRIC FILTER
      ------------------------------------------------ */

      if (
        activeFilter ===
        "linked"
      ) {
        result =
          result.filter(
            (patient) =>
              !!patient.diagnosticReport
          );
      }

      if (
        activeFilter ===
        "critical"
      ) {
        result =
          result.filter(
            (patient) => {
              const report =
                patient.diagnosticReport;

              if (!report) {
                return false;
              }

              const impression =
                report.impression
                  .toLowerCase();

              const finding =
                report.finding.name
                  .toLowerCase();

              const diagnosis =
                report.finalDiagnosis
                  .toLowerCase();

              return (
                impression.includes(
                  "critical"
                ) ||
                impression.includes(
                  "abnormal"
                ) ||
                impression.includes(
                  "urgent"
                ) ||
                impression.includes(
                  "immediate"
                ) ||
                finding.includes(
                  "critical"
                ) ||
                finding.includes(
                  "urgent"
                ) ||
                diagnosis.includes(
                  "critical"
                ) ||
                diagnosis.includes(
                  "urgent"
                )
              );
            }
          );
      }

      /* -----------------------------------------------
         SEARCH
      ------------------------------------------------ */

      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (patient) => {
              const report =
                patient.diagnosticReport;

              return (
                patient.name
                  .toLowerCase()
                  .includes(
                    query
                  ) ||

                patient.patientId
                  .toLowerCase()
                  .includes(
                    query
                  ) ||

                patient.gender
                  .toLowerCase()
                  .includes(
                    query
                  ) ||

                report?.finding.name
                  .toLowerCase()
                  .includes(
                    query
                  ) ||

                report?.impression
                  .toLowerCase()
                  .includes(
                    query
                  ) ||

                report?.finalDiagnosis
                  .toLowerCase()
                  .includes(
                    query
                  )
              );
            }
          );
      }

      return result;
    }, [
      patients,
      activeFilter,
      searchQuery,
    ]);

  /* =======================================================
     RESET FILTER
  ======================================================= */

  const resetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-full bg-[#0B0F17] p-6 text-slate-100">

      {/* ===================================================
          TOAST
      =================================================== */}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] flex max-w-md items-start gap-3 rounded-xl border border-emerald-400/20 bg-[#111622] px-4 py-3 text-xs font-semibold text-white shadow-2xl">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4DE082]" />

          <span>
            {toastMessage}
          </span>
        </div>
      )}

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00F0FF]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7DD3FC]">
              Patient Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Patient Directory
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage patient demographics,
            diagnostic reports, and clinical
            imaging records.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search patients..."
              className="h-11 w-full rounded-xl border border-[#1E2638] bg-[#111622] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-[#00F0FF]/60 sm:w-72"
            />
          </div>

          <button
            type="button"
            onClick={openAddPatient}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00F0FF] px-5 text-xs font-bold text-black shadow-lg shadow-[#00F0FF]/15 transition hover:bg-[#38DFF0] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />

            Add Patient Detail
          </button>
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* TOTAL PATIENTS */}

        <button
          type="button"
          onClick={() => {
            setActiveFilter("all");
            setSearchQuery("");
          }}
          className={`group cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200 ${
            activeFilter === "all"
              ? "border-[#00F0FF] bg-[#111622] ring-2 ring-[#00F0FF]/30"
              : "border-[#1E2638] bg-[#111622]/80 hover:border-[#00F0FF]/50 hover:bg-[#111622]"
          }`}
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Patients
            </span>

            <Users
              className={`h-4 w-4 transition-colors ${
                activeFilter ===
                "all"
                  ? "text-[#00F0FF]"
                  : "text-slate-500 group-hover:text-[#00F0FF]"
              }`}
            />
          </div>

          <p className="mt-3 font-mono text-2xl font-bold text-white">
            {totalPatients}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            All registered patient records
          </p>

          {activeFilter ===
            "all" && (
            <span className="mt-3 inline-flex rounded-md border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-2 py-1 text-[9px] font-bold text-[#00F0FF]">
              ALL PATIENTS
            </span>
          )}
        </button>

        {/* LINKED REPORTS */}

        <button
          type="button"
          onClick={() => {
            setActiveFilter(
              "linked"
            );
            setSearchQuery("");
          }}
          className={`group cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200 ${
            activeFilter ===
            "linked"
              ? "border-[#00F0FF] bg-[#111622] ring-2 ring-[#00F0FF]/30"
              : "border-[#1E2638] bg-[#111622]/80 hover:border-[#00F0FF]/50 hover:bg-[#111622]"
          }`}
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Linked Reports
            </span>

            <FileCheck
              className={`h-4 w-4 transition-colors ${
                activeFilter ===
                "linked"
                  ? "text-[#00F0FF]"
                  : "text-slate-500 group-hover:text-[#00F0FF]"
              }`}
            />
          </div>

          <p className="mt-3 font-mono text-2xl font-bold text-white">
            {linkedReports}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Patients with attached reports
          </p>

          {activeFilter ===
            "linked" && (
            <span className="mt-3 inline-flex rounded-md border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-2 py-1 text-[9px] font-bold text-[#00F0FF]">
              LINKED REPORTS
            </span>
          )}
        </button>

        {/* CRITICAL REPORTS */}

        <button
          type="button"
          onClick={() => {
            setActiveFilter(
              "critical"
            );
            setSearchQuery("");
          }}
          className={`group cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200 ${
            activeFilter ===
            "critical"
              ? "border-red-400 bg-[#111622] ring-2 ring-red-400/20"
              : "border-[#1E2638] bg-[#111622]/80 hover:border-[#00F0FF]/50 hover:bg-[#111622]"
          }`}
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Critical Reports
            </span>

            <AlertTriangle
              className={`h-4 w-4 transition-colors ${
                activeFilter ===
                "critical"
                  ? "text-red-400"
                  : "text-slate-500 group-hover:text-[#00F0FF]"
              }`}
            />
          </div>

          <p className="mt-3 font-mono text-2xl font-bold text-white">
            {criticalReports}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Requires physician review
          </p>

          {activeFilter ===
            "critical" && (
            <span className="mt-3 inline-flex rounded-md border border-red-400/20 bg-red-500/10 px-2 py-1 text-[9px] font-bold text-red-300">
              CRITICAL FILTER
            </span>
          )}
        </button>
      </div>

      {/* ===================================================
          PATIENT TABLE
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-[#1E2638] bg-[#111622]/80 shadow-xl">

        {/* ACTIVE FILTER BAR */}

        {activeFilter !==
          "all" && (
          <div className="flex flex-col gap-3 border-b border-[#1E2638] bg-[#0D111A] px-6 py-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Active Filter
              </span>

              <span
                className={`rounded-md border px-2 py-1 text-[9px] font-bold ${
                  activeFilter ===
                  "critical"
                    ? "border-red-400/20 bg-red-500/10 text-red-300"
                    : "border-[#00F0FF]/20 bg-[#00F0FF]/10 text-[#00F0FF]"
                }`}
              >
                {activeFilter ===
                "critical"
                  ? "CRITICAL REPORTS"
                  : "LINKED REPORTS"}
              </span>

              <span className="font-mono text-[9px] text-slate-600">
                {filteredPatients.length}{" "}
                matching
              </span>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-[#1E2638] bg-[#182030] px-3 py-1.5 text-[9px] font-bold text-slate-400 transition hover:border-[#00F0FF]/50 hover:text-[#00F0FF]"
            >
              Show All
            </button>
          </div>
        )}

        {/* TABLE HEADER */}

        <div className="flex items-center justify-between border-b border-[#1E2638] px-6 py-5">

          <div>
            <h2 className="text-base font-bold text-white">
              Registered Patients
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Patient records and linked
              diagnostic intelligence.
            </p>
          </div>

          <span className="rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3 py-1.5 font-mono text-[10px] text-slate-400">
            {filteredPatients.length} RECORDS
          </span>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[1050px] w-full border-collapse text-left">

            <thead>
              <tr className="border-b border-[#1E2638] bg-[#161B26]">

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Patient
                </th>

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Age / Gender
                </th>

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Date of Birth
                </th>

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Diagnostic Finding
                </th>

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Confidence
                </th>

                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Report
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1E2638]">

              {filteredPatients.map(
                (patient) => {
                  const report =
                    patient.diagnosticReport;

                  return (
                    <tr
                      key={patient.id}
                      onClick={() =>
                        setSelectedPatient(
                          patient
                        )
                      }
                      className="cursor-pointer transition hover:bg-[#182030]/60"
                    >

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-white">
                          {patient.name}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-slate-500">
                          {patient.patientId}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-xs text-slate-300">
                        {patient.age} /{" "}
                        {patient.gender}
                      </td>

                      <td className="px-6 py-5 text-xs text-slate-400">
                        {patient.dateOfBirth ||
                          "Not provided"}
                      </td>

                      <td className="px-6 py-5">

                        <span className="text-xs font-semibold text-slate-200">
                          {report
                            ?.finding
                            .name ||
                            "No report attached"}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        {report ? (
                          <div className="w-28">

                            <div className="mb-1 flex justify-between font-mono text-[10px]">

                              <span className="text-slate-500">
                                AI
                              </span>

                              <span className="text-[#8BD7FF]">
                                {
                                  report
                                    .finding
                                    .confidence
                                }
                                %
                              </span>

                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-[#29313E]">

                              <div
                                className="h-full rounded-full bg-[#00F0FF]"
                                style={{
                                  width: `${report.finding.confidence}%`,
                                }}
                              />

                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600">
                            —
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-5">

                        {report ? (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
                              report.impression ===
                              "Normal"
                                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                                : report.impression ===
                                  "Critical / Immediate Action Required"
                                ? "border-red-400/30 bg-red-500/10 text-red-300"
                                : "border-amber-400/30 bg-amber-500/10 text-amber-300"
                            }`}
                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {report.isFinalized
                              ? "Signed Off"
                              : "Draft"}

                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600">
                            No report
                          </span>
                        )}

                      </td>

                      <td
                        className="px-6 py-5"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditPatient(
                                patient
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E2638] bg-[#182030] px-3 py-2 text-[10px] font-bold text-slate-300 transition hover:bg-[#1E2638] hover:text-white"
                          >
                            <Edit3 className="h-3.5 w-3.5" />

                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleGeneratePDF(
                                patient
                              )
                            }
                            disabled={
                              isGeneratingPDF
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E2638] bg-[#182030] px-3 py-2 text-[10px] font-bold text-slate-300 transition hover:border-[#00F0FF]/50 hover:text-[#8BD7FF] disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {isGeneratingPDF ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}

                            PDF
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPatient(
                                patient
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#1E2638] bg-[#182030] px-3 py-2 text-[10px] font-bold text-[#8BD7FF] transition hover:bg-[#00F0FF] hover:text-black"
                          >
                            Open

                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                }
              )}

              {/* =================================================
                  EMPTY STATE
              ================================================= */}

              {filteredPatients.length ===
                0 && (
                <tr>

                  <td
                    colSpan={7}
                    className="px-6 py-20 text-center"
                  >

                    {activeFilter ===
                    "critical" ? (
                      <>
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/5">
                          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                        </div>

                        <p className="text-sm font-semibold text-white">
                          No critical reports requiring immediate attention.
                        </p>

                        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                          There are currently no patients marked as
                          Critical, Abnormal, or requiring urgent
                          physician review.
                        </p>

                        <button
                          type="button"
                          onClick={
                            resetFilters
                          }
                          className="mt-5 rounded-xl border border-[#1E2638] bg-[#182030] px-4 py-2.5 text-[10px] font-bold text-slate-300 transition hover:border-[#00F0FF]/50 hover:text-[#00F0FF]"
                        >
                          Show All Patients
                        </button>
                      </>
                    ) : (
                      <>
                        <Users className="mx-auto mb-3 h-8 w-8 text-slate-700" />

                        <p className="text-sm font-semibold text-slate-300">
                          No patients found
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {activeFilter ===
                          "linked"
                            ? "No patients currently have an attached diagnostic report."
                            : "Add a patient or adjust your search."}
                        </p>

                        {(searchQuery ||
                          activeFilter !==
                            "all") && (
                          <button
                            type="button"
                            onClick={
                              resetFilters
                            }
                            className="mt-4 rounded-lg border border-[#1E2638] bg-[#182030] px-4 py-2 text-[10px] font-bold text-slate-300 transition hover:border-[#00F0FF]/50 hover:text-white"
                          >
                            Show All
                          </button>
                        )}
                      </>
                    )}

                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          PATIENT DETAIL DRAWER
      =================================================== */}

      {selectedPatient && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/60 backdrop-blur-sm">

          <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-[#1E2638] bg-[#111622] shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1E2638] bg-[#111622]/95 px-6 py-5 backdrop-blur">

              <div>
                <p className="font-mono text-[10px] text-[#00F0FF]">
                  {selectedPatient.patientId}
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {selectedPatient.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E2638] bg-[#182030] text-slate-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              {/* =================================================
                  DEMOGRAPHICS
              ================================================= */}

              <div className="rounded-2xl border border-[#1E2638] bg-[#161B26] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#00F0FF]" />

                    <h3 className="text-sm font-bold text-white">
                      Patient Details
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openEditPatient(
                        selectedPatient
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E2638] bg-[#182030] px-3 py-2 text-[10px] font-bold text-slate-300 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <DetailValue
                    label="Patient ID"
                    value={
                      selectedPatient.patientId
                    }
                    mono
                  />

                  <DetailValue
                    label="Age / Gender"
                    value={`${selectedPatient.age} / ${selectedPatient.gender}`}
                  />

                  <DetailValue
                    label="Date of Birth"
                    value={
                      selectedPatient.dateOfBirth ||
                      "Not provided"
                    }
                  />

                  <DetailValue
                    label="Phone"
                    value={
                      selectedPatient.phone ||
                      "Not provided"
                    }
                    icon={Phone}
                  />

                  <DetailValue
                    label="Email"
                    value={
                      selectedPatient.email ||
                      "Not provided"
                    }
                    icon={Mail}
                  />

                </div>
              </div>

              {/* =================================================
                  AI INSIGHTS
              ================================================= */}

              <div className="rounded-2xl border border-[#1E2638] bg-[#161B26] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Activity className="h-4 w-4 text-[#00F0FF]" />

                    <h3 className="text-sm font-bold text-white">
                      AI Insights & Radiologist Notes
                    </h3>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void handleGeneratePDF(
                        selectedPatient
                      )
                    }
                    disabled={
                      isGeneratingPDF
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[#1E2638] bg-[#182030] px-4 py-2 text-[10px] font-bold text-slate-200 transition hover:border-[#00F0FF]/50 hover:text-[#8BD7FF] disabled:opacity-50"
                  >

                    {isGeneratingPDF ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}

                    {isGeneratingPDF
                      ? "Generating PDF..."
                      : "Generate PDF"}

                  </button>

                </div>

                {selectedPatient.diagnosticReport ? (
                  <DiagnosticReportPreview
                    report={
                      selectedPatient.diagnosticReport
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-[#1E2638] p-8 text-center">

                    <FileText className="mx-auto mb-3 h-7 w-7 text-slate-600" />

                    <p className="text-xs font-semibold text-slate-300">
                      No diagnostic report
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Attach a diagnostic report
                      to this patient.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        openEditPatient(
                          selectedPatient
                        )
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00F0FF] px-4 py-2.5 text-[10px] font-bold text-black"
                    >
                      <Plus className="h-3.5 w-3.5" />

                      Attach Diagnostic Report
                    </button>

                  </div>
                )}

              </div>

              {/* =================================================
                  SECURITY
              ================================================= */}

              <SecurityFooter
                report={
                  selectedPatient.diagnosticReport
                }
              />

              {/* =================================================
                  BOTTOM ACTIONS
              ================================================= */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    openEditPatient(
                      selectedPatient
                    )
                  }
                  className="flex-1 rounded-xl border border-[#1E2638] bg-[#182030] px-4 py-3 text-xs font-bold text-slate-300 hover:bg-[#1E2638]"
                >
                  Attach / Edit Report
                </button>

                <button
                  type="button"
                  disabled={
                    isGeneratingPDF
                  }
                  onClick={() =>
                    void handleGeneratePDF(
                      selectedPatient
                    )
                  }
                  className="flex-1 rounded-xl bg-[#00F0FF] px-4 py-3 text-xs font-bold text-black shadow-lg shadow-[#00F0FF]/10 hover:bg-[#38DFF0] disabled:opacity-50"
                >
                  {isGeneratingPDF
                    ? "Generating PDF..."
                    : "Generate Diagnosis PDF"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">

          <div className="mx-auto my-6 w-full max-w-4xl overflow-hidden rounded-2xl border border-[#293449] bg-[#111622] shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#1E2638] px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00F0FF]/10">
                  <Stethoscope className="h-5 w-5 text-[#00F0FF]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingPatient
                      ? "Edit Patient Detail"
                      : "Add Patient Detail"}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Patient demographics and linked
                    diagnostic report
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* TABS */}

            <div className="flex border-b border-[#1E2638] px-6">

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "patient"
                  )
                }
                className={`border-b-2 px-4 py-4 text-xs font-bold transition ${
                  activeTab ===
                  "patient"
                    ? "border-[#00F0FF] text-[#00F0FF]"
                    : "border-transparent text-slate-500 hover:text-white"
                }`}
              >
                01 Patient Details
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "report"
                  )
                }
                className={`border-b-2 px-4 py-4 text-xs font-bold transition ${
                  activeTab ===
                  "report"
                    ? "border-[#00F0FF] text-[#00F0FF]"
                    : "border-transparent text-slate-500 hover:text-white"
                }`}
              >
                02 Diagnostic Report
              </button>

            </div>

            <form
              onSubmit={
                handleSavePatient
              }
            >

              <div className="max-h-[70vh] overflow-y-auto p-6">

                {/* =================================================
                    PATIENT TAB
                ================================================= */}

                {activeTab ===
                  "patient" && (
                  <section className="space-y-6">

                    <SectionHeading
                      icon={User}
                      title="Patient Demographics"
                      description="Core identity and contact information."
                    />

                    <div className="grid gap-5 md:grid-cols-2">

                      <FormInput
                        label="Patient Name"
                        value={patientName}
                        onChange={
                          setPatientName
                        }
                        placeholder="Enter patient name"
                        required
                      />

                      <FormInput
                        label="Age"
                        type="number"
                        value={age}
                        onChange={
                          setAge
                        }
                        placeholder="Age"
                        required
                      />

                      <FormSelect
                        label="Sex / Gender"
                        value={gender}
                        onChange={(
                          value
                        ) =>
                          setGender(
                            value as Gender
                          )
                        }
                        options={[
                          "Male",
                          "Female",
                          "Other",
                        ]}
                      />

                      <FormInput
                        label="MRN / Patient ID"
                        value={patientId}
                        onChange={
                          setPatientId
                        }
                        placeholder="RAD-2026-XXXX"
                        mono
                        required
                      />

                      <FormInput
                        label="Date of Birth"
                        type="date"
                        value={
                          dateOfBirth
                        }
                        onChange={
                          setDateOfBirth
                        }
                      />

                      <FormInput
                        label="Contact Number"
                        value={phone}
                        onChange={
                          setPhone
                        }
                        placeholder="+92..."
                      />

                      <FormInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={
                          setEmail
                        }
                        placeholder="patient@example.com"
                      />

                    </div>

                    <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

                      <div className="flex gap-3">

                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#00F0FF]" />

                        <div>

                          <p className="text-xs font-bold text-white">
                            Protected Patient Record
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            Patient information should
                            only be accessed by
                            authorized clinical personnel
                            in the production system.
                          </p>

                        </div>
                      </div>
                    </div>

                  </section>
                )}

                {/* =================================================
                    REPORT TAB
                ================================================= */}

                {activeTab ===
                  "report" && (
                  <section className="space-y-7">

                    <SectionHeading
                      icon={FileCheck}
                      title="Linked Diagnostic Report"
                      description="Attach structured AI-assisted clinical findings to this patient."
                    />

                    {/* CLINICAL HISTORY */}

                    <div>

                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Clinical History
                      </label>

                      <textarea
                        value={
                          clinicalHistory
                        }
                        onChange={(
                          event
                        ) =>
                          setClinicalHistory(
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="Symptoms, past medical history, referral reason..."
                        className="w-full resize-none rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 text-xs leading-5 text-white outline-none placeholder:text-slate-600 focus:border-[#00F0FF]/60"
                      />

                    </div>

                    {/* AI FINDINGS */}

                    <div className="rounded-2xl border border-[#1E2638] bg-[#161B26] p-5">

                      <div className="mb-5 flex items-center gap-2">

                        <Activity className="h-4 w-4 text-[#00F0FF]" />

                        <h3 className="text-sm font-bold text-white">
                          AI Findings & Anomaly Detection
                        </h3>

                      </div>

                      <div className="grid gap-5 md:grid-cols-2">

                        <FormSelect
                          label="Target Condition"
                          value={
                            findingName
                          }
                          onChange={
                            setFindingName
                          }
                          options={
                            FINDING_OPTIONS
                          }
                        />

                        <div>

                          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            AI Confidence
                          </label>

                          <div className="flex items-center gap-4">

                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={
                                confidence
                              }
                              onChange={(
                                event
                              ) =>
                                setConfidence(
                                  Number(
                                    event
                                      .target
                                      .value
                                  )
                                )
                              }
                              className="w-full accent-[#00F0FF]"
                            />

                            <span className="min-w-[48px] rounded-lg bg-[#0B0F17] px-2 py-2 text-center font-mono text-xs text-[#8BD7FF]">
                              {confidence}%
                            </span>

                          </div>
                        </div>

                      </div>

                      {/* TERMINOLOGY */}

                      {(() => {
                        const finding =
                          getTerminology(
                            findingName,
                            confidence
                          );

                        return (
                          <div className="mt-5 grid gap-3 md:grid-cols-2">

                            <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                RadLex
                              </span>

                              <p className="mt-2 font-mono text-xs text-[#8BD7FF]">
                                {
                                  finding.radlexCode
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                {
                                  finding.radlexLabel
                                }
                              </p>

                            </div>

                            <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                SNOMED CT
                              </span>

                              <p className="mt-2 font-mono text-xs text-[#8BD7FF]">
                                SCTID{" "}
                                {
                                  finding.snomedCode
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                {
                                  finding.snomedLabel
                                }
                              </p>

                            </div>

                          </div>
                        );
                      })()}

                    </div>

                    {/* METRICS */}

                    <div>

                      <SectionHeading
                        icon={
                          Activity
                        }
                        title="Imaging Metrics"
                        description="Quantitative measurements associated with the study."
                      />

                      <div className="mt-4 grid gap-5 md:grid-cols-2">

                        <FormInput
                          label="Cardiothoracic Ratio (CTR)"
                          value={ctr}
                          onChange={
                            setCtr
                          }
                          placeholder="0.48"
                          mono
                        />

                        <FormInput
                          label="Lung Volume"
                          value={
                            lungVolume
                          }
                          onChange={
                            setLungVolume
                          }
                          placeholder="6.2L"
                          mono
                        />

                      </div>

                    </div>

                    {/* NOTES */}

                    <div>

                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Radiologist Clinical Notes
                      </label>

                      <textarea
                        value={
                          radiologistNotes
                        }
                        onChange={(
                          event
                        ) =>
                          setRadiologistNotes(
                            event.target.value
                          )
                        }
                        rows={5}
                        className="w-full resize-none rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 text-xs leading-5 text-white outline-none focus:border-[#00F0FF]/60"
                      />

                    </div>

                    {/* IMPRESSION */}

                    <div>

                      <SectionHeading
                        icon={
                          AlertTriangle
                        }
                        title="Impression / Diagnosis"
                        description="Classify the final clinical interpretation."
                      />

                      <div className="mt-4">

                        <FormSelect
                          label="Clinical Category"
                          value={
                            impression
                          }
                          onChange={(
                            value
                          ) =>
                            setImpression(
                              value as Impression
                            )
                          }
                          options={[
                            "Normal",
                            "Abnormal",
                            "Critical / Immediate Action Required",
                          ]}
                        />

                      </div>

                      <textarea
                        value={
                          finalDiagnosis
                        }
                        onChange={(
                          event
                        ) =>
                          setFinalDiagnosis(
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="Enter final diagnosis summary..."
                        className="mt-4 w-full resize-none rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 text-xs leading-5 text-white outline-none placeholder:text-slate-600 focus:border-[#00F0FF]/60"
                      />

                    </div>

                    {/* SIGNATURE */}

                    <div className="rounded-2xl border border-[#1E2638] bg-[#0B0F17] p-5">

                      <div className="flex items-start gap-3">

                        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#4DE082]" />

                        <div>

                          <p className="text-xs font-bold text-white">
                            Digital Signature Verification
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {RADIOLOGIST_NAME} ·{" "}
                            {RADIOLOGIST_ROLE}
                          </p>

                          <p className="mt-1 font-mono text-[9px] text-slate-600">
                            License:{" "}
                            {LICENSE_NUMBER}
                          </p>

                        </div>

                      </div>

                    </div>

                  </section>
                )}

              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#1E2638] bg-[#0D111A] px-6 py-5 sm:flex-row sm:justify-between">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="rounded-xl border border-[#1E2638] bg-[#182030] px-5 py-3 text-xs font-bold text-slate-300 transition hover:bg-[#1E2638] hover:text-white"
                >
                  Cancel
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {editingPatient && (
                    <button
                      type="button"
                      disabled={
                        isGeneratingPDF
                      }
                      onClick={() =>
                        void handleGeneratePDF(
                          {
                            ...editingPatient,

                            name:
                              patientName,

                            patientId:
                              patientId,

                            age:
                              Number(
                                age
                              ),

                            gender,

                            dateOfBirth,

                            phone,

                            email,

                            diagnosticReport:
                              {
                                id:
                                  editingPatient
                                    .diagnosticReport
                                    ?.id ||
                                  `RPT-${Date.now()}`,

                                clinicalHistory,

                                finding:
                                  getTerminology(
                                    findingName,
                                    confidence
                                  ),

                                ctr,

                                lungVolume,

                                radiologistNotes,

                                impression,

                                finalDiagnosis,

                                radiologistName:
                                  RADIOLOGIST_NAME,

                                radiologistRole:
                                  RADIOLOGIST_ROLE,

                                licenseNumber:
                                  LICENSE_NUMBER,

                                signedAt:
                                  new Date().toLocaleString(),

                                isFinalized:
                                  editingPatient
                                    .diagnosticReport
                                    ?.isFinalized ||
                                  false,
                              },
                          }
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E2638] bg-[#182030] px-5 py-3 text-xs font-bold text-slate-200 transition hover:border-[#00F0FF]/50 hover:text-[#8BD7FF] disabled:opacity-50"
                    >

                      {isGeneratingPDF ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}

                      {isGeneratingPDF
                        ? "Generating PDF..."
                        : "Generate PDF"}

                    </button>
                  )}

                  {activeTab ===
                    "patient" && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          "report"
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E2638] bg-[#182030] px-5 py-3 text-xs font-bold text-slate-200 hover:bg-[#1E2638]"
                    >
                      Continue to Report

                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00F0FF] px-6 py-3 text-xs font-bold text-black shadow-lg shadow-[#00F0FF]/15 transition hover:bg-[#38DFF0] active:scale-[0.98]"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    {editingPatient
                      ? "Update Patient & Report"
                      : "Save Patient & Report"}
                  </button>

                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <Icon className="mt-0.5 h-4 w-4 text-[#00F0FF]" />

      <div>

        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>

        <p className="mt-1 text-[10px] text-slate-500">
          {description}
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">

        {label}

        {required && (
          <span className="ml-1 text-[#00F0FF]">
            *
          </span>
        )}

      </label>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-[#1E2638] bg-[#0B0F17] px-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-[#00F0FF]/60 ${
          mono
            ? "font-mono"
            : ""
        }`}
      />

    </div>
  );
}

/* =========================================================
   FORM SELECT
========================================================= */

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-[#1E2638] bg-[#0B0F17] px-4 text-xs text-white outline-none focus:border-[#00F0FF]/60"
      >

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>
    </div>
  );
}

/* =========================================================
   DETAIL VALUE
========================================================= */

function DetailValue({
  label,
  value,
  mono = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ElementType;
}) {
  return (
    <div>

      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="mt-1 flex items-center gap-2">

        {Icon && (
          <Icon className="h-3.5 w-3.5 text-slate-500" />
        )}

        <p
          className={`text-xs text-slate-300 ${
            mono
              ? "font-mono"
              : ""
          }`}
        >
          {value}
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   DIAGNOSTIC REPORT PREVIEW
========================================================= */

function DiagnosticReportPreview({
  report,
}: {
  report: LinkedDiagnosticReport;
}) {
  return (
    <div className="space-y-4">

      {/* FINDING */}

      <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

        <div className="flex items-center justify-between">

          <span className="text-xs font-bold text-white">
            {report.finding.name}
          </span>

          <span className="rounded-lg bg-amber-500/10 px-2 py-1 font-mono text-[10px] text-amber-300">
            {report.finding.confidence}%
          </span>

        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#29313E]">

          <div
            className="h-full rounded-full bg-[#00F0FF]"
            style={{
              width: `${report.finding.confidence}%`,
            }}
          />

        </div>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-2 gap-3">

        <MetricBox
          label="CTR"
          value={report.ctr}
        />

        <MetricBox
          label="Lung Volume"
          value={
            report.lungVolume
          }
        />

      </div>

      {/* NOTES */}

      <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
          Clinical Notes
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-300">
          {
            report.radiologistNotes
          }
        </p>

      </div>

      {/* IMPRESSION */}

      <div
        className={`rounded-xl border p-4 ${
          report.impression ===
          "Normal"
            ? "border-emerald-400/20 bg-emerald-500/5"
            : report.impression ===
              "Critical / Immediate Action Required"
            ? "border-red-400/20 bg-red-500/5"
            : "border-amber-400/20 bg-amber-500/5"
        }`}
      >

        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
          Impression
        </p>

        <p className="mt-2 text-xs font-semibold text-white">
          {report.impression}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          {report.finalDiagnosis}
        </p>

      </div>

      {/* TERMINOLOGY */}

      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-3">

          <p className="text-[9px] uppercase text-slate-600">
            RadLex
          </p>

          <p className="mt-1 font-mono text-[10px] text-[#8BD7FF]">
            {
              report.finding.radlexCode
            }
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            {
              report.finding.radlexLabel
            }
          </p>

        </div>

        <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-3">

          <p className="text-[9px] uppercase text-slate-600">
            SNOMED CT
          </p>

          <p className="mt-1 font-mono text-[10px] text-[#8BD7FF]">
            {
              report.finding.snomedCode
            }
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            {
              report.finding.snomedLabel
            }
          </p>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   METRIC BOX
========================================================= */

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-mono text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SECURITY FOOTER
========================================================= */

function SecurityFooter({
  report,
}: {
  report?: LinkedDiagnosticReport;
}) {
  return (
    <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4">

      <div className="flex items-start gap-3">

        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00F0FF]" />

        <div>

          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
            Security & Digital Verification
          </p>

          <p className="mt-2 text-[9px] leading-5 text-slate-600">
            {COMPLIANCE_TEXT}
          </p>

          <div className="mt-3 grid gap-2 text-[9px] text-slate-500 sm:grid-cols-3">

            <span>
              Radiologist:{" "}
              <strong className="text-slate-300">
                {report?.radiologistName ||
                  RADIOLOGIST_NAME}
              </strong>
            </span>

            <span>
              License:{" "}
              <strong className="text-slate-300">
                {report?.licenseNumber ||
                  LICENSE_NUMBER}
              </strong>
            </span>

            <span>
              Verified:{" "}
              <strong className="text-slate-300">
                {report?.signedAt ||
                  "Pending sign-off"}
              </strong>
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}